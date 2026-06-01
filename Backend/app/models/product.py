from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Product(Base):
    """Product model."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_product_name", "name"),
        Index("idx_product_sku", "sku"),
    )

    class Config:
        from_attributes = True
