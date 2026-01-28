import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Ride service functions
export const rideService = {
  // User endpoints
  bookRide: async (rideData) => {
    const response = await api.post('/api/users/book', rideData);
    return response.data;
  },

  getCurrentRide: async () => {
    const response = await api.get('/api/users/ride/current');
    return response.data;
  },

  getRideHistory: async () => {
    const response = await api.get('/api/users/ride/history');
    return response.data;
  },

  // Driver endpoints
  updateDriverAvailability: async (available) => {
    const response = await api.post(`/api/drivers/availability?available=${available}`);
    return response.data;
  },

  getAvailableRideRequests: async () => {
    const response = await api.get('/api/drivers/rides/requests');
    return response.data;
  },

  acceptRide: async (rideId) => {
    const response = await api.post(`/api/drivers/rides/accept?rideId=${rideId}`);
    return response.data;
  },

  updateRideStatus: async (status) => {
    const response = await api.post(`/api/drivers/rides/status?status=${status}`);
    return response.data;
  },

  getDriverCurrentRide: async () => {
    const response = await api.get('/api/drivers/rides/current');
    return response.data;
  },

  getDriverRideHistory: async () => {
    const response = await api.get('/api/drivers/rides/history');
    return response.data;
  },

  // General ride endpoints
  getRideById: async (rideId) => {
    const response = await api.get(`/api/rides/${rideId}`);
    return response.data;
  },

  updateRideStatusById: async (rideId, status) => {
    const response = await api.post(`/api/rides/${rideId}/status?status=${status}`);
    return response.data;
  }
};

export default rideService;