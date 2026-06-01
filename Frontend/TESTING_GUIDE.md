# Frontend Testing Guide

Complete testing checklist for the Ethara AI Frontend application.

## Prerequisites

- Backend API running on http://localhost:8000
- Frontend running on http://localhost:5173 (or deployment URL)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Test data in database (optional)

## 1. Dashboard Page Testing

### Test 1.1: Page Load
- [ ] Navigate to http://localhost:5173
- [ ] Page loads without errors
- [ ] Dashboard title and layout are visible
- [ ] No console errors

### Test 1.2: Metrics Display
- [ ] Total Products card displays a number
- [ ] Total Customers card displays a number
- [ ] Total Orders card displays a number
- [ ] All values are greater than or equal to 0

### Test 1.3: Low Stock Products
- [ ] Low Stock Products section appears
- [ ] Products are listed if any have low stock
- [ ] Each product shows: Name, SKU, Stock Quantity, Price
- [ ] "Everything in stock" message appears if no low stock items

### Test 1.4: Responsive Design
- [ ] Desktop (1920px): All cards in one row
- [ ] Tablet (768px): Cards wrap appropriately
- [ ] Mobile (375px): Each card takes full width

---

## 2. Products Page Testing

### Test 2.1: Page Load
- [ ] Navigate to /products
- [ ] Products page loads
- [ ] Search bar is visible
- [ ] "Add Product" button is visible

### Test 2.2: View Products
- [ ] Products table displays all products
- [ ] Table shows: Name, SKU, Price, Stock, Actions
- [ ] Pagination controls appear (if > 10 products)
- [ ] Can change rows per page (5, 10, 20)

### Test 2.3: Search Functionality
- [ ] Type in search box
- [ ] Products filter by name or SKU in real-time
- [ ] Clear search to see all products again
- [ ] Search is case-insensitive

### Test 2.4: Add Product
- [ ] Click "Add Product" button
- [ ] Dialog opens with form fields
- [ ] Form shows: Name, SKU, Price, Stock Quantity
- [ ] All fields are required
- [ ] Can enter values in all fields
- [ ] Submit button is disabled until required fields filled
- [ ] Click "Save" to create product
- [ ] Success notification appears
- [ ] Product appears in table
- [ ] Dialog closes

### Test 2.5: Edit Product
- [ ] Click Edit (pencil) icon on a product
- [ ] Dialog opens with product data pre-filled
- [ ] Can modify any field
- [ ] Click "Save" to update
- [ ] Success notification appears
- [ ] Changes reflect in table

### Test 2.6: Delete Product
- [ ] Click Delete (trash) icon on a product
- [ ] Confirmation dialog appears
- [ ] Dialog asks "Delete product from the system?"
- [ ] Click "Cancel" to abort
- [ ] Click "Confirm" to delete
- [ ] Success notification appears
- [ ] Product removed from table

### Test 2.7: Pagination
- [ ] If > 10 products, pagination shows
- [ ] Can navigate between pages
- [ ] Previous/Next buttons work correctly
- [ ] Rows per page selector works

### Test 2.8: Empty State
- [ ] Delete all products (or search with no results)
- [ ] "No products found" message appears
- [ ] "Add a new product..." suggestion shown
- [ ] Table not displayed in empty state

---

## 3. Customers Page Testing

### Test 3.1: Page Load
- [ ] Navigate to /customers
- [ ] Customers page loads
- [ ] Search bar is visible
- [ ] "Add Customer" button is visible

### Test 3.2: View Customers
- [ ] Customers table displays all customers
- [ ] Table shows: Full Name, Email, Phone, Actions
- [ ] Pagination controls appear (if > 10 customers)

### Test 3.3: Search Functionality
- [ ] Search by name, email, or phone
- [ ] Results filter in real-time
- [ ] Search is case-insensitive

### Test 3.4: Add Customer
- [ ] Click "Add Customer" button
- [ ] Dialog opens with form fields
- [ ] Form shows: Full Name, Email, Phone
- [ ] Full Name and Email are required
- [ ] Phone is optional
- [ ] Submit button disabled until required fields filled
- [ ] Click "Save"
- [ ] Success notification appears
- [ ] Customer added to table
- [ ] Dialog closes

### Test 3.5: Delete Customer
- [ ] Click Delete icon on a customer
- [ ] Confirmation dialog appears
- [ ] Click "Confirm" to delete
- [ ] Success notification appears
- [ ] Customer removed from table

### Test 3.6: Pagination
- [ ] Pagination works correctly if multiple customers exist

### Test 3.7: Empty State
- [ ] When no customers exist
- [ ] "No customers found" message appears

---

## 4. Orders Page Testing

### Test 4.1: Page Load
- [ ] Navigate to /orders
- [ ] Orders page loads
- [ ] "Create a New Order" form visible
- [ ] Existing orders table visible

### Test 4.2: Create Order - Basic
- [ ] Select a customer from dropdown
- [ ] Customer dropdown shows all available customers
- [ ] At least one product dropdown appears
- [ ] Click "Add Product" button
- [ ] New product row appears
- [ ] Can remove product rows (delete icon)
- [ ] Cannot remove if only one product row

### Test 4.3: Create Order - Fill Form
- [ ] Select customer: "John Doe"
- [ ] Select product 1: "Laptop"
- [ ] Enter quantity: "2"
- [ ] Estimated total displays: e.g., "$2,498.00"
- [ ] Add second product: "Mouse"
- [ ] Quantity: "1"
- [ ] Estimated total updates

### Test 4.4: Create Order - Submit
- [ ] Click "Create Order" button
- [ ] Button shows loading state (disabled)
- [ ] API request sent with correct format:
  ```json
  {
    "customer_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 1}
    ]
  }
  ```
- [ ] Order appears in orders table
- [ ] Success notification shown
- [ ] Form resets for next order

### Test 4.5: View Orders Table
- [ ] All orders display in table
- [ ] Columns show: ID, Customer, Items, Total, Created, Actions
- [ ] Customer names appear correctly
- [ ] Item count is accurate
- [ ] Total amount displays with $ symbol
- [ ] Created date shows formatted date

### Test 4.6: View Order Details
- [ ] Click View (eye) icon on an order
- [ ] Navigates to /orders/{id}
- [ ] Order ID displays
- [ ] Customer info shows: Name, Email, Phone
- [ ] Products section shows all items
- [ ] Each product shows: Name, Quantity, Unit Price, Subtotal
- [ ] Total amount matches order
- [ ] Created date displays

### Test 4.7: Delete Order
- [ ] Click Delete icon on an order
- [ ] Confirmation dialog appears
- [ ] Click "Confirm" to delete
- [ ] Order removed from table
- [ ] Success notification shown

### Test 4.8: Order Details - Back Navigation
- [ ] On order details page
- [ ] Click "Back to Orders" button
- [ ] Returns to /orders page
- [ ] Orders table still displays

### Test 4.9: Empty State
- [ ] When no orders exist
- [ ] "No orders yet" message appears
- [ ] "Create your first order using the form above" shown

---

## 5. Routing Tests

### Test 5.1: Navigation Links
- [ ] Sidebar "Dashboard" link → /
- [ ] Sidebar "Products" link → /products
- [ ] Sidebar "Customers" link → /customers
- [ ] Sidebar "Orders" link → /orders
- [ ] Current page highlighted in sidebar

### Test 5.2: Direct URL Navigation
- [ ] Type http://localhost:5173/ → Dashboard
- [ ] Type http://localhost:5173/products → Products
- [ ] Type http://localhost:5173/customers → Customers
- [ ] Type http://localhost:5173/orders → Orders
- [ ] Type http://localhost:5173/orders/1 → Order Details

### Test 5.3: 404 Handling
- [ ] Type http://localhost:5173/nonexistent
- [ ] "404" message appears
- [ ] "Page not found" message appears
- [ ] "Return to dashboard" button works

### Test 5.4: Invalid Order ID
- [ ] Type http://localhost:5173/orders/999999
- [ ] "Order not found" message appears
- [ ] Can navigate back to orders

---

## 6. Responsive Design Tests

### Test 6.1: Mobile (375px)
- [ ] Sidebar becomes hamburger menu
- [ ] Click hamburger to open sidebar
- [ ] Click link in sidebar to close it
- [ ] Content is readable
- [ ] Tables scroll horizontally
- [ ] Forms are accessible

### Test 6.2: Tablet (768px)
- [ ] Sidebar visible
- [ ] Content adapts to width
- [ ] Navigation works smoothly

### Test 6.3: Desktop (1920px)
- [ ] Full layout displays
- [ ] All content visible
- [ ] No horizontal scrolling needed

---

## 7. Error Handling Tests

### Test 7.1: Network Error
- [ ] Stop backend API
- [ ] Try to load page
- [ ] Error notification appears
- [ ] User-friendly error message shown
- [ ] Not a cryptic error code

### Test 7.2: Form Validation
- [ ] Try to create product without name
- [ ] Save button remains disabled
- [ ] Add name, can submit
- [ ] Price field accepts decimals (10.50)
- [ ] Stock field accepts only integers

### Test 7.3: Deleted Items
- [ ] Delete a product
- [ ] Try to view order containing that product
- [ ] Order details still display with product info

---

## 8. Notification Tests

### Test 8.1: Success Notifications
- [ ] Add a product → "Product saved successfully"
- [ ] Update a product → "Product saved successfully"
- [ ] Delete a product → "Product deleted"
- [ ] Create an order → "Order created successfully"

### Test 8.2: Error Notifications
- [ ] Invalid API call → Error message displayed
- [ ] Network error → "Unable to..." message

### Test 8.3: Notification Behavior
- [ ] Notifications auto-dismiss after ~4 seconds
- [ ] Can manually close by clicking X
- [ ] Multiple notifications queue up
- [ ] Color coded: Green (success), Red (error)

---

## 9. Data Persistence Tests

### Test 9.1: Create and Verify
- [ ] Create a product with specific name: "Test Product 001"
- [ ] Refresh page (F5)
- [ ] Product still appears in table
- [ ] Data persists on backend

### Test 9.2: Search Persistence
- [ ] Search for a product
- [ ] Results filter correctly
- [ ] Refresh page
- [ ] Search bar is cleared
- [ ] All products visible again

### Test 9.3: Pagination Persistence
- [ ] Navigate to page 2
- [ ] Refresh page
- [ ] Back to page 1 (page state not saved)

---

## 10. Performance Tests

### Test 10.1: Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] Products page loads in < 2 seconds
- [ ] No visual jank or stuttering

### Test 10.2: Search Performance
- [ ] Type quickly in search box
- [ ] No lag or delays
- [ ] Results update smoothly

### Test 10.3: Table Performance
- [ ] Tables render smoothly with 100+ items
- [ ] Pagination works without lag
- [ ] Scrolling is smooth

---

## 11. Accessibility Tests

### Test 11.1: Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Can reach all buttons via Tab
- [ ] Can activate buttons via Enter/Space
- [ ] Modal dialogs trap focus

### Test 11.2: Screen Reader
- [ ] Form labels properly associated with inputs
- [ ] Buttons have descriptive text
- [ ] Images have alt text (if any)
- [ ] Tables have proper headers

### Test 11.3: Color Contrast
- [ ] Text is readable against backgrounds
- [ ] Button text contrasts with button color
- [ ] Error messages are not only red (+ icon)

---

## 12. Browser Compatibility Tests

Test in each browser:

### Chrome (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Responsive design works

### Firefox (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Forms work correctly

### Safari (Latest)
- [ ] All features work
- [ ] Responsive design works on iPhone

### Edge (Latest)
- [ ] All features work
- [ ] No compatibility issues

---

## 13. API Integration Tests

### Test 13.1: GET Requests
- [ ] `/dashboard` - Returns metrics
- [ ] `/products` - Returns product list
- [ ] `/customers` - Returns customer list
- [ ] `/orders` - Returns order list
- [ ] `/orders/{id}` - Returns specific order

### Test 13.2: POST Requests
- [ ] `/products` - Creates product correctly
- [ ] `/customers` - Creates customer correctly
- [ ] `/orders` - Creates order with items correctly

### Test 13.3: PUT Requests
- [ ] `/products/{id}` - Updates product fields

### Test 13.4: DELETE Requests
- [ ] `/products/{id}` - Removes product
- [ ] `/customers/{id}` - Removes customer
- [ ] `/orders/{id}` - Removes order

---

## 14. Security Tests

### Test 14.1: Input Validation
- [ ] Cannot inject HTML in product name
- [ ] Special characters handled safely
- [ ] Very long strings truncated appropriately

### Test 14.2: XSS Protection
- [ ] No script tags executed in forms
- [ ] User input properly escaped

### Test 14.3: API Security
- [ ] Requests use HTTPS in production
- [ ] CORS headers properly configured
- [ ] No sensitive data in localStorage

---

## 15. Regression Tests (After Updates)

Run these tests after any code changes:

### Critical Path
- [ ] Dashboard loads and displays metrics
- [ ] Can create a product
- [ ] Can search products
- [ ] Can create a customer
- [ ] Can create an order
- [ ] Can view order details
- [ ] Can delete an order
- [ ] No console errors

---

## Test Result Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Dashboard | ✓ | - | |
| Products | ✓ | - | |
| Customers | ✓ | - | |
| Orders | ✓ | - | |
| Routing | ✓ | - | |
| Responsive | ✓ | - | |
| Error Handling | ✓ | - | |
| Notifications | ✓ | - | |
| Performance | ✓ | - | |
| Accessibility | ✓ | - | |
| Browser Compat | ✓ | - | |
| API Integration | ✓ | - | |
| Security | ✓ | - | |

---

## Automated Testing (Optional)

For future implementation:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Create test files
src/components/__tests__/ProductDialog.test.jsx
src/pages/__tests__/ProductsPage.test.jsx
# ... etc

# Run tests
npm run test
```

---

## Sign-Off

- **Tester Name:** _______________
- **Date:** _______________
- **Browser/Device:** _______________
- **Overall Result:** [ ] PASS [ ] FAIL
- **Notes:** _______________

---

For any bugs found, create an issue with:
1. Expected behavior
2. Actual behavior
3. Steps to reproduce
4. Browser/device used
5. Screenshots/videos (if applicable)
