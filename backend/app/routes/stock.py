from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.stock import StockMovement
from app.models.product import Product
from app.schemas.stock import StockCreate, StockOut
from app.routes.auth import get_current_user

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.post("/", response_model=StockOut)
def create_stock(
    stock: StockCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == stock.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if stock.type == "IN":
        product.quantity += stock.quantity
    elif stock.type == "OUT":
        if product.quantity < stock.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        product.quantity -= stock.quantity
    else:
        raise HTTPException(status_code=400, detail="Invalid type")

    movement = StockMovement(
        product_id=stock.product_id,
        type=stock.type,
        quantity=stock.quantity,
        note=stock.note,
        user_id=user.id,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement


@router.get("/{product_id}", response_model=list[StockOut])
def get_stock_history(product_id: int, db: Session = Depends(get_db)):
    return (
        db.query(StockMovement)
        .filter(StockMovement.product_id == product_id)
        .order_by(StockMovement.created_at.desc())
        .all()
    )
