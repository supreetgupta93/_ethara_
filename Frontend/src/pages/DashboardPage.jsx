import { Box, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotificationContext } from '../context/NotificationContext';
import dashboardService from '../services/dashboardService';
import { formatCurrency } from '../utils/format';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then((response) => setSummary(response.data))
      .catch((error) => {
        showNotification({ message: error.message || 'Unable to load dashboard', severity: 'error' });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!summary) {
    return <EmptyState title="Dashboard unavailable" description="Unable to load dashboard. Please try again later." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Products
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {summary.total_products ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Customers
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {summary.total_customers ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {summary.total_orders ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Low Stock Products
        </Typography>
        {summary.low_stock_products?.length ? (
          <Card elevation={2}>
            <CardContent>
              <List>
                {summary.low_stock_products.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.name}
                      secondary={`SKU: ${item.sku} — Available: ${item.stock_quantity}`}
                    />
                    <Typography variant="subtitle2" color="primary">
                      {formatCurrency(item.price ?? 0)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ) : (
          <EmptyState title="Everything in stock" description="No low stock alerts at the moment." />
        )}
      </Box>
    </Box>
  );
}
