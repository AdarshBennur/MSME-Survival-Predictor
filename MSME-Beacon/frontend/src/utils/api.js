import axios from 'axios';

// Base URL for API calls
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Risk API functions
export const riskAPI = {
  // Test backend connectivity
  testConnection: async () => {
    const response = await api.get('/test');
    return response.data;
  },

  // Predict risk using ML service - ONLY uses your trained model
  predictRisk: async (businessData) => {
    console.log('🎯 Sending prediction request to backend...');
    console.log('Data being sent:', businessData);
    
    const response = await api.post('/risk/predict-demo', businessData);
    console.log('✅ Backend responded:', response.data);
    return response.data;
  },
};

export default api; 