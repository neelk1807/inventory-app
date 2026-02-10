from fastapi import APIRouter, Depends , HTTPException
from app.core.security import require_admin
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    result = []

    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "quantity": p.quantity,
            "category_id": p.category_id,
            "category_name": p.category.name if p.category else None
        })

    return result

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # update fields manually
    product.name = data.name
    product.description = data.description
    product.price = data.price
    product.quantity = data.quantity
    product.category_id = data.category_id

    db.commit()
    db.refresh(product)

    return product
