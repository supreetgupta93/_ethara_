import logging

from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from app.models import Product, Order, OrderItem, Customer
from app.schemas.order import OrderCreate

logger = logging.getLogger(__name__)


class OrderService:
    """Service for handling order-related business logic."""

    @staticmethod
    def create_order(db: Session, order_data: OrderCreate) -> Order:
        """
        Create a new order with transaction handling.
        
        Args:
            db: Database session
            order_data: Order creation data with items
            
        Returns:
            Created Order object
            
        Raises:
            HTTPException: If validation fails or transaction error occurs
        """
        try:
            # Verify customer exists
            customer = db.query(Customer).filter(
                Customer.id == order_data.customer_id
            ).first()
            
            if not customer:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Customer with id {order_data.customer_id} not found"
                )
            
            # Validate and check stock for all items
            order_items_data = []
            total_amount = 0
            
            for item in order_data.items:
                product = db.query(Product).filter(
                    Product.id == item.product_id
                ).first()
                
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Product with id {item.product_id} not found"
                    )
                
                # Check stock availability
                if product.stock_quantity < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Insufficient stock for product {product.name}. "
                               f"Available: {product.stock_quantity}, Requested: {item.quantity}"
                    )
                
                item_total = product.price * item.quantity
                total_amount += item_total
                order_items_data.append({
                    "product": product,
                    "quantity": item.quantity,
                    "unit_price": product.price,
                    "item_total": item_total,
                })
            
            order = Order(
                customer_id=order_data.customer_id,
                total_amount=total_amount
            )
            db.add(order)
            db.flush()  # Flush to get the order id
            
            # Create order items and update stock
            for item_data in order_items_data:
                product = item_data["product"]
                
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item_data["quantity"],
                    unit_price=item_data["unit_price"]
                )
                db.add(order_item)
                
                # Reduce stock (implements business rule #5)
                product.stock_quantity -= item_data["quantity"]

            db.commit()
            db.refresh(order)
            return order
            
        except HTTPException:
            db.rollback()
            raise
        except SQLAlchemyError:
            logger.exception("Database error while creating order")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while creating order"
            )
        except Exception:
            logger.exception("Unexpected error while creating order")
            db.rollback()
            raise

    @staticmethod
    def get_order_with_items(db: Session, order_id: int) -> Order:
        """
        Get order with all its items.
        
        Args:
            db: Database session
            order_id: Order ID
            
        Returns:
            Order object with items
            
        Raises:
            HTTPException: If order not found
        """
        order = (
            db.query(Order)
            .options(selectinload(Order.items))
            .filter(Order.id == order_id)
            .first()
        )
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with id {order_id} not found"
            )
        
        return order
