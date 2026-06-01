import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductDialog from '../components/ProductDialog';
import { NotificationContext } from '../context/NotificationContext';
import productsService from '../services/productsService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const { showNotification } = useContext(NotificationContext);

  const loadProducts = () => {
    setLoading(true);
    productsService
      .getProducts()
      .then((response) => setProducts(response.data || []))
      .catch((error) => showNotification({ message: error.message || 'Unable to load products', severity: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
    );
  }, [products, search]);

  const currentProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const handleSaveProduct = (payload) => {
    const action = selectedProduct
      ? productsService.updateProduct(selectedProduct.id, payload)
      : productsService.createProduct(payload);

    action
      .then(() => {
        showNotification({ message: 'Product saved successfully', severity: 'success' });
        setDialogOpen(false);
        setSelectedProduct(null);
        loadProducts();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to save product', severity: 'error' }));
  };

  const handleDeleteProduct = () => {
    productsService
      .deleteProduct(deleteProductId)
      .then(() => {
        showNotification({ message: 'Product deleted', severity: 'success' });
        setDeleteProductId(null);
        loadProducts();
      })
      .catch((error) => showNotification({ message: error.message || 'Unable to delete product', severity: 'error' }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Search products by name or SKU"
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">Search</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
                Add Product
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState title="No products found" description="Add a new product or adjust your search." />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setSelectedProduct(product); setDialogOpen(true); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteProductId(product.id)}>
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
            count={filteredProducts.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      )}

      <ProductDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedProduct(null); }}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
      <ConfirmationDialog
        open={Boolean(deleteProductId)}
        title="Delete product"
        description="This action cannot be undone. Are you sure you want to delete this product?"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductId(null)}
      />
    </Box>
  );
}
