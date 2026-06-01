from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


class CustomerBase(BaseModel):
    """Base schema for Customer."""
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)


class CustomerCreate(CustomerBase):
    """Schema for creating a Customer."""
    pass


class CustomerUpdate(BaseModel):
    """Schema for updating a Customer."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)


class CustomerResponse(CustomerBase):
    """Schema for Customer response."""
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }
