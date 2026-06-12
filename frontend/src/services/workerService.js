import api from './api';

const workerService = {
  createOrUpdateProfile: async (profileData) => {
    // profileData contains { skill, experience, location, photoUrl }
    const response = await api.post('/workers/profile', profileData);
    return response.data;
  },

  getAllWorkers: async (skill = '') => {
    const response = await api.get('/workers', {
      params: skill ? { skill } : {}
    });
    return response.data;
  },

  getWorkerById: async (id) => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  }
};

export default workerService;
