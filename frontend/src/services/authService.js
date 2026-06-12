import api from './api';

const authService = {
  register: async (name, phone, password, role) => {
    const response = await api.post('/auth/register', { name, phone, password, role });
    return response.data;
  },

  login: async (phone, password) => {
    const response = await api.post('/auth/login', { phone, password });
    return response.data;
  }
};

export default authService;
