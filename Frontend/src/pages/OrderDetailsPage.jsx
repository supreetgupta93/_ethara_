import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotificationContext } from '../context/NotificationContext';
import ordersService from '../services/ordersService';
import { formatCurrency, formatDate } from '../utils/format';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    ordersService
      .getOrderById(id)
      .then((response) => setOrder(response.data))
      .catch((error) => showNotification({ message: error.message || 'Unable to load order details', severity: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!order) {
    return <EmptyState title="Order not found" description="The requested order could not be loaded." />;
  }

  const total = order.total_amount ?? order.items?.reduce((sum, item) => {
    const price = item.unit_price ?? item.product?.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 3 }}>
        Back to Orders
      </Button>
      <Typography variant="h4" gutterBottom>
        Order #{order.id}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Customer
              </Typography>
              <Typography variant="h6">{order.customer?.full_name}</Typography>
              <Typography>{order.customer?.email}</Typography>
              <Typography>{order.customer?.phone}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Order Summary
              </Typography>
              <Typography>Total Items: {order.items?.length ?? 0}</Typography>
              <Typography>Created: {formatDate(order.created_at)}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total: {formatCurrency(total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Products
        </Typography>
        <Card elevation={2}>
          <CardContent>
            <List>
              {order.items?.map((item) => (
                <ListItem key={`${item.product_id || item.id}-${item.quantity}`} divider>
                  <ListItemText
                    primary={item.product?.name || item.product_name || 'Product'}
                    secondary={`Quantity: ${item.quantity} • Unit Price: ${formatCurrency(item.unit_price ?? item.product?.price ?? 0)}`}
                  />
                  <Typography>{formatCurrency((item.unit_price ?? item.product?.price ?? 0) * item.quantity)}</Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
