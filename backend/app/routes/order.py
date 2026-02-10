from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.utils.pdf import generate_invoice
from fastapi.responses import StreamingResponse
import os
from app.schemas.order import OrderCreate, OrderOut
from app.routes.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/{order_id}/invoice")
def get_invoice(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .all()
    )

    pdf_buffer = generate_invoice(order, items , user)

    return StreamingResponse(
    pdf_buffer,
    media_type="application/pdf",
    headers={
        "Content-Disposition": f"attachment; filename=invoice_{order_id}.pdf"
    },
)

    
@router.post("/", response_model=OrderOut)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    total = 0

    new_order = Order(
        user_id=user.id,
        total_amount=0
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.quantity < item.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        # reduce stock
        product.quantity -= item.quantity

        line_total = product.price * item.quantity
        total += line_total

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        )
        db.add(order_item)

    new_order.total_amount = total
    db.commit()
    db.refresh(new_order)

    return new_order