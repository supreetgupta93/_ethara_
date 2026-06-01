import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

const initialForm = { name: '', sku: '', price: '', stock_quantity: '' };

export default function ProductDialog({ open, onClose, onSave, product }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
      });
    } else {
      setForm(initialForm);
    }
  }, [product]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    onSave({
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price) || 0,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SKU"
              required
              fullWidth
              value={form.sku}
              onChange={handleChange('sku')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              type="number"
              required
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
              value={form.price}
              onChange={handleChange('price')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock Quantity"
              type="number"
              required
              fullWidth
              inputProps={{ min: '0' }}
              value={form.stock_quantity}
              onChange={handleChange('stock_quantity')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!form.name || !form.sku} onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
