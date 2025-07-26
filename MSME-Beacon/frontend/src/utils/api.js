import axios from 'axios';

// Base URL for API calls - ensure it's pointing to the deployed backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('🔗 API Base URL:', BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Risk API functions
export const riskAPI = {
  // Test backend connectivity
  testConnection: async () => {
    try {
      console.log('🔍 Testing backend connection...');
      const response = await api.get('/test');
      console.log('✅ Backend connection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      throw error;
    }
  },

  // Predict risk using ML service - ONLY uses your trained model
  predictRisk: async (businessData) => {
    console.log('🎯 Sending prediction request to backend...');
    console.log('Data being sent:', businessData);
    
    try {
      const response = await api.post('/risk/predict-demo', businessData);
      console.log('✅ Backend responded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Prediction request failed:', error);
      throw error;
    }
  },
};

export default api; 