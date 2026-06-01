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

const initialCustomer = { full_name: '', email: '', phone: '' };

export default function CustomerDialog({ open, onClose, onSave, customer }) {
  const [form, setForm] = useState(initialCustomer);

  useEffect(() => {
    if (customer) {
      setForm({
        full_name: customer.full_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    } else {
      setForm(initialCustomer);
    }
  }, [customer]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    onSave({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={form.full_name}
              onChange={handleChange('full_name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              required
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={handleChange('phone')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!form.full_name || !form.email} onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
