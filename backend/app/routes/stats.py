from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.product import Product
from app.models.category import Category

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()

    low_stock = db.query(Product).filter(Product.quantity < 5).count()

    total_value = db.query(
        func.coalesce(func.sum(Product.price * Product.quantity), 0)
    ).scalar()

    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "low_stock_items": low_stock,
        "total_value": total_value,
    }
