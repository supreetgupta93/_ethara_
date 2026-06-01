from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Customer(Base):
    """Customer model."""
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_customer_email", "email"),
        Index("idx_customer_full_name", "full_name"),
    )

    class Config:
        from_attributes = True
