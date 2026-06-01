from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer",
)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new customer.
    
    - **full_name**: Customer's full name
    - **email**: Customer's unique email address
    - **phone**: Customer's phone number (optional)
    """
    try:
        db_customer = Customer(**customer_data.model_dump())
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer
    except IntegrityError as e:
        db.rollback()
        if "email" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer already exists"
        )


@router.get(
    "",
    response_model=List[CustomerResponse],
    summary="List all customers with pagination and search",
)
def list_customers(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    search: str = Query(None, description="Search customers by name"),
    db: Session = Depends(get_db),
):
    """
    Get all customers with optional pagination and search.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 10, max: 100)
    - **search**: Optional search term for customer name
    """
    query = db.query(Customer)
    
    if search:
        query = query.filter(Customer.full_name.ilike(f"%{search}%"))
    
    customers = query.offset(skip).limit(limit).all()
    return customers


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
    summary="Get customer by ID",
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a specific customer by ID.
    
    - **customer_id**: Customer ID
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found"
        )
    
    return customer


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
    summary="Update a customer",
)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing customer.
    
    - **customer_id**: Customer ID
    - **full_name**: Customer's full name (optional)
    - **email**: Customer's email address (optional)
    - **phone**: Customer's phone number (optional)
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found"
        )
    
    update_data = customer_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(customer, key, value)

    try:
        db.commit()
        db.refresh(customer)
        return customer
    except IntegrityError as e:
        db.rollback()
        if "email" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer update failed due to a conflict"
        )


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a customer",
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a customer by ID.
    
    - **customer_id**: Customer ID
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with id {customer_id} not found"
        )
    
    db.delete(customer)
    db.commit()
