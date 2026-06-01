# Quick Start Guide

Get the Ethara AI Frontend running in 5 minutes.

## Option 1: Development Mode (Recommended for Development)

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

**Output:**
```
  VITE v5.4.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Open in Browser
Navigate to: **http://localhost:5173**

### 4. Verify Backend
Ensure backend is running on http://localhost:8000:
```bash
curl http://localhost:8000/docs
```

---

## Option 2: Production Build (Testing Production Behavior)

### 1. Build Optimized Bundle
```bash
cd Frontend
npm install
npm run build
```

Output: `dist/` folder with optimized files

### 2. Preview Build
```bash
npm run preview
```

Navigate to: **http://localhost:4173**

---

## Option 3: Docker (Full Containerization)

### 1. Build Docker Image
```bash
docker build -t ethara-ai-frontend .
```

### 2. Run Container
```bash
docker run -p 3000:3000 ethara-ai-frontend
```

Navigate to: **http://localhost:3000**

### 3. Stop Container
```bash
docker ps          # Find container ID
docker stop <ID>   # Stop it
```

---

## Option 4: Docker Compose (Full Stack)

### 1. Start Both Frontend & Backend
From project root:
```bash
docker-compose up -d
```

### 2. Wait for Services
- Frontend: http://localhost:3000 (after ~10 seconds)
- Backend: http://localhost:8000 (after ~15 seconds)

### 3. Check Logs
```bash
docker-compose logs -f frontend    # Frontend logs
docker-compose logs -f backend     # Backend logs
```

### 4. Stop Services
```bash
docker-compose down
```

---

## Testing the Application

### 1. Dashboard
- Click "Dashboard" in sidebar
- Should see: Total Products, Total Customers, Total Orders

### 2. Add a Product
- Click "Products"
- Click "Add Product"
- Fill: Name, SKU, Price, Stock
- Click "Save"

### 3. Add a Customer
- Click "Customers"
- Click "Add Customer"
- Fill: Full Name, Email, Phone
- Click "Save"

### 4. Create an Order
- Click "Orders"
- Select customer
- Add 1+ products
- Click "Create Order"

### 5. View Order
- Click View (eye icon) on an order
- See details with items and total

---

## Troubleshooting

### Issue: "port 5173 already in use"
**Solution:**
```bash
# Use different port
npm run dev -- --port 5174
```

### Issue: "Backend not responding"
**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/docs

# If not, start it in another terminal
cd Backend
python -m uvicorn app.main:app --reload
```

### Issue: "npm: command not found"
**Solution:**
Install Node.js from: https://nodejs.org (LTS recommended)

### Issue: "VITE_API_URL not working"
**Solution:**
Create `.env` file in Frontend folder:
```env
VITE_API_URL=http://localhost:8000
```

### Issue: "Components not rendering"
**Solution:**
Check browser console for errors:
1. Press F12
2. Click "Console" tab
3. Look for red errors
4. Check network tab (F12 → Network)

---

## Key Endpoints

All requests go to backend at `VITE_API_URL`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard` | Metrics |
| GET | `/products` | List products |
| POST | `/products` | Create product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| GET | `/customers` | List customers |
| POST | `/customers` | Create customer |
| DELETE | `/customers/{id}` | Delete customer |
| GET | `/orders` | List orders |
| POST | `/orders` | Create order |
| GET | `/orders/{id}` | Get order details |
| DELETE | `/orders/{id}` | Delete order |

---

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Production (.env.production)
```env
VITE_API_URL=https://api.ethara.com
```

To use production config:
```bash
npm run build   # Uses .env.production automatically
```

---

## File Structure Overview

```
Frontend/
├── src/
│   ├── App.jsx                 # Root component
│   ├── main.jsx               # Entry point
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components
│   ├── routes/                # Routing config
│   ├── services/              # API calls
│   ├── context/               # Global state (notifications)
│   ├── hooks/                 # Custom hooks
│   └── utils/                 # Utilities
├── package.json               # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── Dockerfile                # Container config
├── .env                      # Development config
└── .env.production           # Production config
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code (if configured)
npm run lint

# Run tests (if configured)
npm run test
```

---

## Performance Tips

- **Development:** Use `npm run dev` (hot reload enabled)
- **Production:** Use `npm run build` then `npm run preview`
- **Deployment:** Use Docker for consistency across environments
- **Monitoring:** Check browser DevTools → Performance tab

---

## Getting Help

1. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed test cases
2. Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment options
3. Check [PRODUCTION_AUDIT.md](./PRODUCTION_AUDIT.md) for code quality checklist
4. View [README.md](./README.md) for project overview

---

## Next Steps

After running the app:

1. **Add sample data:**
   - Create 3+ products
   - Create 2+ customers
   - Create 1+ orders

2. **Test all features:**
   - Search products
   - Pagination
   - Edit/delete operations
   - Navigation between pages

3. **Check production readiness:**
   - Run `npm run build`
   - Run `npm run preview`
   - Build Docker image: `docker build -t ethara-ai .`

4. **Deploy:**
   - Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Choose: Docker, Kubernetes, or static hosting

---

**Estimated Time to First Run:** 3-5 minutes (including npm install)

Good to go! 🚀
