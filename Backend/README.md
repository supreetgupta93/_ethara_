# Inventory & Order Management API

A production-ready FastAPI backend for managing inventory and orders with PostgreSQL, SQLAlchemy ORM, Pydantic validation, and Docker support.

## Features

- ✅ **FastAPI** - Modern, fast web framework
- ✅ **PostgreSQL** - Robust relational database
- ✅ **SQLAlchemy ORM** - Python SQL toolkit
- ✅ **Pydantic** - Data validation using Python type annotations
- ✅ **Alembic** - Database migrations
- ✅ **Docker & Docker Compose** - Containerization
- ✅ **CORS** - Cross-origin resource sharing for React frontend
- ✅ **Transaction Management** - Atomic order creation with rollback
- ✅ **Pagination** - List endpoints with skip/limit
- ✅ **Search** - Search products and customers by name
- ✅ **Swagger UI** - Interactive API documentation
- ✅ **Health Checks** - Service monitoring endpoints

## Prerequisites

- Python 3.11+
- PostgreSQL 12+
- Docker & Docker Compose (for containerized setup)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database setup and session management
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── product.py
│   │   ├── customer.py
│   │   ├── order.py
│   │   └── order_item.py
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── product.py
│   │   ├── customer.py
│   │   └── order.py
│   ├── routers/                # API endpoint routes
│   │   ├── __init__.py
│   │   ├── products.py
│   │   ├── customers.py
│   │   ├── orders.py
│   │   └── dashboard.py
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   └── order_service.py    # Order creation with transaction handling
│   └── utils/                  # Utility functions
│       └── __init__.py
├── alembic/                    # Database migration scripts
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Production Docker image
├── docker-compose.yml          # Local development setup
├── .dockerignore
├── .env.example                # Environment variables template
├── alembic.ini                 # Alembic configuration
└── README.md
```

## Setup & Installation

### Option 1: Local Development (Requires PostgreSQL)

1. **Clone or navigate to the project**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory
   DEBUG=False
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the application**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   Application will be available at: `http://localhost:8000`

### Option 2: Docker Compose (Recommended)

1. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Start PostgreSQL database
   - Start FastAPI application
   - Create all database tables automatically

2. **Check status**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop containers**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes**
   ```bash
   docker-compose down -v
   ```

## API Documentation

### Swagger UI
- **URL**: `http://localhost:8000/docs`
- Interactive API testing and documentation

### ReDoc
- **URL**: `http://localhost:8000/redoc`
- Alternative API documentation

## Endpoints

### Health Check
```
GET /health
```
Response: `{"status": "healthy"}`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | List products (paginated) |
| GET | `/products/{id}` | Get product details |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

**Query Parameters for GET /products:**
- `skip` (int): Records to skip (default: 0)
- `limit` (int): Records to return (default: 10, max: 100)
- `search` (string): Search by product name

**Example:**
```bash
# Create product
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAPTOP-001",
    "price": 999.99,
    "stock_quantity": 50
  }'

# List products with search
curl "http://localhost:8000/products?search=laptop&skip=0&limit=10"
```

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create customer |
| GET | `/customers` | List customers (paginated) |
| GET | `/customers/{id}` | Get customer details |
| PUT | `/customers/{id}` | Update customer |
| DELETE | `/customers/{id}` | Delete customer |

**Query Parameters for GET /customers:**
- `skip` (int): Records to skip (default: 0)
- `limit` (int): Records to return (default: 10, max: 100)
- `search` (string): Search by customer name

**Example:**
```bash
# Create customer
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'

# List customers
curl "http://localhost:8000/customers?skip=0&limit=10"
```

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders` | List orders (paginated) |
| GET | `/orders/{id}` | Get order details |
| DELETE | `/orders/{id}` | Delete order |

**Order Creation:**
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      },
      {
        "product_id": 2,
        "quantity": 1
      }
    ]
  }'
```

**Business Rules for Orders:**
- Stock must be available for all items
- Stock is automatically reduced upon order creation
- Total amount is calculated by the backend
- Transaction is rolled back on any failure

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get analytics |

**Response:**
```json
{
  "total_products": 25,
  "total_customers": 10,
  "total_orders": 5,
  "low_stock_products": 3
}
```

## Database Schema

### products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price FLOAT NOT NULL,
  stock_quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### customers
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total_amount FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### order_items
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price FLOAT NOT NULL
);
```

## Database Migrations

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback
```bash
alembic downgrade -1
```

### View migration history
```bash
alembic current
```

## Environment Variables

Create a `.env` file from `.env.example`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory

# Application
APP_NAME=Inventory & Order Management API
APP_VERSION=1.0.0
DEBUG=False

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
```

## Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | OK - Successful GET request |
| 201 | Created - Successful resource creation |
| 400 | Bad Request - Invalid request body |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Business rule violation (e.g., insufficient stock, duplicate SKU) |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

**Example Error Response:**
```json
{
  "detail": "Insufficient stock for product Laptop. Available: 5, Requested: 10"
}
```

## Best Practices Implemented

✅ **Clean Architecture**
- Separation of concerns (models, schemas, routers, services)
- Service layer for business logic

✅ **Database**
- Foreign key constraints with cascade delete
- Indexes on frequently queried columns
- Transaction support with rollback

✅ **API Design**
- RESTful endpoints
- Proper HTTP status codes
- Meaningful error messages
- Pagination support
- Search functionality

✅ **Code Quality**
- Type hints throughout
- Pydantic validation
- SQL injection prevention via SQLAlchemy ORM
- Environment-based configuration

✅ **Docker**
- Multi-stage builds for smaller images
- Non-root user for security
- Health checks
- Proper layer caching

✅ **Documentation**
- Swagger/OpenAPI documentation
- Docstrings for all endpoints
- Clear request/response schemas

## Testing

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8000/health

# Create product
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse","sku":"MOUSE-001","price":29.99,"stock_quantity":100}'

# Create customer
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Alice","email":"alice@example.com","phone":"+1111111111"}'

# Create order
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":1,"quantity":2}]}'
```

## Production Deployment

### Docker Build
```bash
docker build -t inventory-api:1.0.0 .
```

### Docker Run
```bash
docker run -d \
  --name inventory-api \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:password@db-host:5432/inventory" \
  inventory-api:1.0.0
```

### Using Docker Compose for production
Update `docker-compose.yml`:
- Remove `reload` flag
- Add resource limits
- Configure proper logging
- Use environment-specific .env files

## Troubleshooting

### Database Connection Error
```
Error: could not connect to server: Connection refused
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct.

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000  # On Linux/Mac
netstat -ano | findstr :8000  # On Windows

# Kill process
kill -9 <PID>  # On Linux/Mac
taskkill /PID <PID> /F  # On Windows
```

### Database Migration Issues
```bash
# Reset migrations (WARNING: Deletes all data)
alembic downgrade base
alembic upgrade head
```

## Performance Optimization

- Database indexes on foreign keys and frequently searched columns
- Connection pooling configured in SQLAlchemy
- Pagination to limit result sets
- Non-blocking async operations ready
- Health checks for load balancer integration

## Security Features

- Non-root Docker user
- Environment-based sensitive configuration
- SQL injection prevention via ORM
- Input validation with Pydantic
- CORS configuration
- Type hints for runtime safety

## License

MIT

## Support

For issues or questions, please check:
1. Database connection and migrations
2. Environment variables in .env
3. Docker container logs: `docker-compose logs app`
4. Application logs in console

---

**Built with ❤️ using FastAPI, PostgreSQL, and SQLAlchemy**
