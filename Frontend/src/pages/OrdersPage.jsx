import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderForm from '../components/OrderForm';
import { NotificationContext } from '../context/NotificationContext';
import customersService from '../services/customersService';
import ordersService from '../services/ordersService';
import productsService from '../services/productsService';
import { formatCurrency, formatDate } from '../utils/format';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const { showNotification } = useContext(NotificationContext);

  const loadData = () => {
    setLoading(true);
    Promise.all([ordersService.getOrders(), customersService.getCustomers(), productsService.getProducts()])
      .then(([ordersResponse, customersResponse, productsResponse]) => {
        setOrders(ordersResponse.data || []);
        setCustomers(customersResponse.data || []);
        setProducts(productsResponse.data || []);
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to load orders', severity: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = (payload) => {
    setCreatingOrder(true);
    ordersService
      .createOrder(payload)
      .then(() => {
        showNotification({ message: 'Order created successfully', severity: 'success' });
        loadData();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to create order', severity: 'error' }))
      .finally(() => setCreatingOrder(false));
  };

  const handleDeleteOrder = () => {
    ordersService
      .deleteOrder(deleteOrderId)
      .then(() => {
        showNotification({ message: 'Order deleted', severity: 'success' });
        setDeleteOrderId(null);
        loadData();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to delete order', severity: 'error' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <OrderForm customers={customers} products={products} onSubmit={handleCreateOrder} loading={creatingOrder} />
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Existing Orders
          </Typography>
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" description="Create your first order using the form above." />
          ) : (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => {
                      const itemCount = order.items?.length || 0;
                      const total = order.total_amount ?? order.items?.reduce((sum, item) => {
                        const price = item.unit_price ?? item.product?.price ?? 0;
                        return sum + price * (item.quantity || 0);
                      }, 0);

                      return (
                        <TableRow key={order.id} hover>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer?.full_name || 'Unknown'}</TableCell>
                          <TableCell>{itemCount}</TableCell>
                          <TableCell>{formatCurrency(total)}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell align="right">
                            <IconButton component={RouterLink} to={`/orders/${order.id}`}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => setDeleteOrderId(order.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={Boolean(deleteOrderId)}
        title="Delete order"
        description="Delete this order from the system? This action cannot be undone."
        onConfirm={handleDeleteOrder}
        onCancel={() => setDeleteOrderId(null)}
      />
    </Box>
  );
}
