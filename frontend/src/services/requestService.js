import api from './api';

const requestService = {
  createRequest: async (requestData) => {
    // requestData: { workerId, description, address, phone }
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getRequestsForCustomer: async () => {
    const response = await api.get('/requests/customer');
    return response.data;
  },

  getRequestsForWorker: async () => {
    const response = await api.get('/requests/worker');
    return response.data;
  },

  updateRequestStatus: async (requestId, status) => {
    const response = await api.put(`/requests/${requestId}/status`, { status });
    return response.data;
  }
};

export default requestService;
