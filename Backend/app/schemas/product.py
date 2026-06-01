from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProductBase(BaseModel):
    """Base schema for Product."""
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    """Schema for creating a Product."""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating a Product."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)


class ProductResponse(ProductBase):
    """Schema for Product response."""
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }
