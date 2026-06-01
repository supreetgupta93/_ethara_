from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.database import get_db
from app.models import Product, Customer, Order

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


class DashboardResponse(BaseModel):
    """Dashboard analytics response."""
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: int

    model_config = {
        "from_attributes": True,
    }


@router.get(
    "",
    response_model=DashboardResponse,
    summary="Get dashboard analytics",
)
def get_dashboard(
    db: Session = Depends(get_db),
):
    """
    Get dashboard analytics.
    
    Returns:
    - **total_products**: Total number of products in inventory
    - **total_customers**: Total number of customers
    - **total_orders**: Total number of orders
    - **low_stock_products**: Number of products with stock < 10
    """
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    low_stock_products = (
        db.query(func.count(Product.id))
        .filter(Product.stock_quantity < 10)
        .scalar() or 0
    )
    
    return DashboardResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_products=low_stock_products,
    )
