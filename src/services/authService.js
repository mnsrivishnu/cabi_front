import axios from 'axios';

// ✅ MUST be set in Netlify as:
// VITE_API_BASE_URL=https://cabbackend-production-955b.up.railway.app/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================= AUTH SERVICE =================
export const authService = {

  // -------- USER REGISTER --------
  registerUser: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  // -------- DRIVER REGISTER --------
  registerDriver: async (driverData) => {
    const response = await api.post('/api/drivers/register', driverData);
    return response.data;
  },

  // -------- USER LOGIN --------
  loginUser: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    const token = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', 'USER');

    return token;
  },

  // -------- DRIVER LOGIN --------
  loginDriver: async (credentials) => {
    const response = await api.post('/api/drivers/login', credentials);
    const token = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', 'DRIVER');

    return token;
  },

  // -------- USER PROFILE --------
  getUserProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // -------- DRIVER PROFILE --------
  getDriverProfile: async () => {
    const response = await api.get('/api/drivers/profile');
    const driver = response.data;

    // normalize backend field
    return {
      ...driver,
      isAvailable: driver.available,
    };
  },

  // -------- LOGOUT --------
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  // -------- AUTH HELPERS --------
  isAuthenticated: () => !!localStorage.getItem('token'),

  getRole: () => localStorage.getItem('role'),

  getToken: () => localStorage.getItem('token'),
};

export default authService;
