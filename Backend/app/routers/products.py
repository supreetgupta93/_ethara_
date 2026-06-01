from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database import get_db
from app.models import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new product.
    
    - **name**: Product name
    - **sku**: Unique stock keeping unit
    - **price**: Product price (must be positive)
    - **stock_quantity**: Initial stock quantity
    """
    try:
        db_product = Product(**product_data.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except IntegrityError as e:
        db.rollback()
        if "sku" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="SKU already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product already exists"
        )


@router.get(
    "",
    response_model=List[ProductResponse],
    summary="List all products with pagination and search",
)
def list_products(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    search: str = Query(None, description="Search products by name"),
    db: Session = Depends(get_db),
):
    """
    Get all products with optional pagination and search.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 10, max: 100)
    - **search**: Optional search term for product name
    """
    query = db.query(Product)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Get product by ID",
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a specific product by ID.
    
    - **product_id**: Product ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    
    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Update a product",
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing product.
    
    - **product_id**: Product ID
    - **name**: Product name (optional)
    - **sku**: Product SKU (optional)
    - **price**: Product price (optional)
    - **stock_quantity**: Stock quantity (optional)
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    
    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    try:
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError as e:
        db.rollback()
        if "sku" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="SKU already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product update failed due to a conflict"
        )


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a product by ID.
    
    - **product_id**: Product ID
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    
    db.delete(product)
    db.commit()
