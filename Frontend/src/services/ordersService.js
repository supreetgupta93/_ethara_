import api from './api';

const ordersService = {
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (payload) => api.post('/orders', payload),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export default ordersService;
