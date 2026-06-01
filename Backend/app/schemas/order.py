from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class OrderItemBase(BaseModel):
    """Base schema for OrderItem."""
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderItemRequest(OrderItemBase):
    """Schema for OrderItem request."""
    pass


OrderItemCreate = OrderItemRequest


class OrderItemResponse(OrderItemBase):
    """Schema for OrderItem response."""
    id: int
    unit_price: float

    model_config = {
        "from_attributes": True,
    }


class OrderBase(BaseModel):
    """Base schema for Order."""
    customer_id: int = Field(..., gt=0)


class OrderCreate(OrderBase):
    """Schema for creating an Order."""
    items: List[OrderItemRequest] = Field(..., min_items=1)


class OrderResponse(OrderBase):
    """Schema for Order response."""
    id: int
    total_amount: float
    items: List[OrderItemResponse]
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class OrderDetailResponse(OrderResponse):
    """Detailed Order response with customer info."""

    model_config = {
        "from_attributes": True,
    }
