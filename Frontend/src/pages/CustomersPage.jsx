import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import CustomerDialog from '../components/CustomerDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotificationContext } from '../context/NotificationContext';
import customersService from '../services/customersService';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const { showNotification } = useContext(NotificationContext);

  const loadCustomers = () => {
    setLoading(true);
    customersService
      .getCustomers()
      .then((response) => setCustomers(response.data || []))
      .catch((error) => showNotification({ message: error.message || 'Unable to load customers', severity: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.full_name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const currentCustomers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredCustomers.slice(start, start + rowsPerPage);
  }, [filteredCustomers, page, rowsPerPage]);

  const handleSaveCustomer = (payload) => {
    customersService
      .createCustomer(payload)
      .then(() => {
        showNotification({ message: 'Customer created successfully', severity: 'success' });
        setDialogOpen(false);
        loadCustomers();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to save customer', severity: 'error' }));
  };

  const handleDeleteCustomer = () => {
    customersService
      .deleteCustomer(deleteCustomerId)
      .then(() => {
        showNotification({ message: 'Customer deleted', severity: 'success' });
        setDeleteCustomerId(null);
        loadCustomers();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to delete customer', severity: 'error' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Search customers"
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">Search</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
                Add Customer
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 ? (
        <EmptyState title="No customers found" description="Add a new customer or adjust your search." />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>{customer.full_name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => setDeleteCustomerId(customer.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      )}

      <CustomerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCustomer}
      />
      <ConfirmationDialog
        open={Boolean(deleteCustomerId)}
        title="Delete customer"
        description="This action cannot be undone. Do you want to delete this customer?"
        onConfirm={handleDeleteCustomer}
        onCancel={() => setDeleteCustomerId(null)}
      />
    </Box>
  );
}
