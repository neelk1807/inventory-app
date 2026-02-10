from pydantic import BaseModel
from typing import List

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderOut(BaseModel):
    id: int
    total_amount: float

    class Config:
        from_attributes = True
