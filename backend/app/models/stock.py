from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    type = Column(String, nullable=False)  # IN or OUT
    quantity = Column(Integer, nullable=False)
    note = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
    user = relationship("User")
