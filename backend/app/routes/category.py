from fastapi import APIRouter, Depends
from sqlalchemy.orm import relationship , Session
from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryOut
from app.core.security import require_admin

router = APIRouter(prefix="/categories" , tags=["Categories"])

@router.post("/", response_model=CategoryOut)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(
        name=category.name,
        description=category.description,
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=list[CategoryOut])
def list_category(db: Session = Depends(get_db)):
    return db.query(Category).all()

from fastapi import HTTPException

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()

    return {"message": "Category deleted"}

@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # update fields
    category.name = data.name
    category.description = data.description

    db.commit()
    db.refresh(category)

    return category

