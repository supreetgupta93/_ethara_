import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const createItem = () => ({ product_id: '', quantity: '1' });

export default function OrderForm({ customers, products, onSubmit, loading }) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([createItem()]);

  useEffect(() => {
    if (customers.length && !customerId) {
      setCustomerId(customers[0]?.id?.toString() || '');
    }
  }, [customers, customerId]);

  const handleItemChange = (index, field) => (event) => {
    const updatedItems = [...items];
    updatedItems[index][field] = event.target.value;
    setItems(updatedItems);
  };

  const addRow = () => setItems((prev) => [...prev, createItem()]);

  const removeRow = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    onSubmit({
      customer_id: parseInt(customerId, 10),
      items: items
        .filter((item) => item.product_id)
        .map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10) || 1,
        })),
    });
  };

  const isFormDisabled = !customerId || items.some((item) => !item.product_id);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = products.find((product) => product.id?.toString() === item.product_id);
      const price = parseFloat(product?.price ?? 0);
      const quantity = parseInt(item.quantity, 10) || 0;
      return acc + price * quantity;
    }, 0);
  }, [items, products]);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Order
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            label="Select Customer"
            fullWidth
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id?.toString()}>
                {customer.full_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        {items.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  label="Product"
                  fullWidth
                  value={item.product_id}
                  onChange={handleItemChange(index, 'product_id')}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id?.toString()}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  inputProps={{ min: 1 }}
                  onChange={handleItemChange(index, 'quantity')}
                />
              </Grid>
              <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                <IconButton color="error" onClick={() => removeRow(index)} disabled={items.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Button startIcon={<AddCircleOutlineIcon />} variant="outlined" onClick={addRow}>
            Add Product
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography variant="subtitle2" color="text.secondary">
            Estimated Order Total: ${subtotal.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          disabled={isFormDisabled || loading}
          onClick={handleSubmit}
          variant="contained"
        >
          Create Order
        </Button>
      </Box>
    </Paper>
  );
}
