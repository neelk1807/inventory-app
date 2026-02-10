from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StockCreate(BaseModel):
    product_id: int
    type: str
    quantity: int
    note: Optional[str] = None


class StockOut(BaseModel):
    id: int
    product_id: int
    type: str
    quantity: int
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
