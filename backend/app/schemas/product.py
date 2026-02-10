from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    quantity: int
    category_id: int
    
class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    name: str
    description: str | None
    price: float
    quantity: int
    category_id: int
    category_name: str

    
    class Config:
        from_attributes = True