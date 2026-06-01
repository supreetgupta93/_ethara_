import api from './api';

const customersService = {
  getCustomers: () => api.get('/customers'),
  createCustomer: (payload) => api.post('/customers', payload),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

export default customersService;
