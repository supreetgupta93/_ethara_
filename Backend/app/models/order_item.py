from sqlalchemy import Column, Integer, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class OrderItem(Base):
    """OrderItem model - junction table between Orders and Products."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    # Indexes
    __table_args__ = (
        Index("idx_order_item_order_id", "order_id"),
        Index("idx_order_item_product_id", "product_id"),
    )

    class Config:
        from_attributes = True
