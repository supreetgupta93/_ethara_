import api from './api';

const productsService = {
  getProducts: () => api.get('/products'),
  createProduct: (payload) => api.post('/products', payload),
  updateProduct: (id, payload) => api.put(`/products/${id}`, payload),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productsService;
