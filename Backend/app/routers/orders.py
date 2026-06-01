from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, selectinload
from typing import List
from app.database import get_db
from app.models import Order
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order",
)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new order.
    
    - **customer_id**: ID of the customer placing the order
    - **items**: List of items with product_id and quantity
    
    Business Rules:
    - Stock must be available for all items
    - Stock is automatically reduced upon order creation
    - Transaction is rolled back on any failure
    """
    order = OrderService.create_order(db, order_data)
    return order


@router.get(
    "",
    response_model=List[OrderResponse],
    summary="List all orders with pagination",
)
def list_orders(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    db: Session = Depends(get_db),
):
    """
    Get all orders with optional pagination.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 10, max: 100)
    """
    orders = (
        db.query(Order)
        .options(selectinload(Order.items))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return orders


@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    summary="Get order by ID",
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a specific order by ID with all its items.
    
    - **order_id**: Order ID
    """
    order = OrderService.get_order_with_items(db, order_id)
    return order


@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an order",
)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete an order by ID.
    
    Note: Deleting an order does NOT restore the stock.
    
    - **order_id**: Order ID
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {order_id} not found"
        )
    
    db.delete(order)
    db.commit()
