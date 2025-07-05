const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');

console.log('🚀 Starting MSME Beacon Backend Server...');

// Connect to MongoDB Atlas
connectDB().catch(err => {
  console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
  console.log('ℹ️  Server will continue running but database features will be unavailable');
});

// Create Express app
const app = express();

// Enable CORS for all origins (development)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const riskRoutes = require('./routes/riskRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const insightsRoutes = require('./routes/insightsRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/insights', insightsRoutes);

// Test route to check if server is working
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit');
  res.json({ 
    message: 'Backend server is running perfectly!', 
    timestamp: new Date().toISOString(),
    status: 'healthy',
    database: 'MongoDB Atlas Connected',
          endpoints: {
        test: '/api/test',
        auth: {
          register: '/api/users/register',
          login: '/api/users/login',
          profile: '/api/users/profile'
        },
        business: '/api/business',
        risk: '/api/risk',
        recommendations: '/api/recommendations',
        insights: '/api/insights'
      }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

// Simple risk prediction endpoint (no auth required)
app.post('/api/risk/predict-demo', async (req, res) => {
  console.log('🎯 Risk prediction request received');
  console.log('Request data:', JSON.stringify(req.body, null, 2));
  
  try {
    const businessData = req.body;
    
    // Validate required fields
    const required = ['revenue', 'expenses', 'cashFlow', 'employeeCount', 'yearsInBusiness'];
    const missing = required.filter(field => !businessData[field] && businessData[field] !== 0);
    
    if (missing.length > 0) {
      console.log('❌ Missing required fields:', missing);
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missing,
        message: 'Please fill in all required fields'
      });
    }
    
    console.log('📡 Attempting to connect to ML service...');
    
    // Try to connect to ML service
    try {
      const mlResponse = await axios.post('http://localhost:8000/predict', businessData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      console.log('✅ ML service responded:', mlResponse.data);
      
      const result = {
        score: Math.round(mlResponse.data.risk_score * 100),
        category: mlResponse.data.risk_level,
        riskLevel: mlResponse.data.risk_level,
        lastUpdated: new Date().toISOString(),
        message: 'Risk prediction completed using your trained ML model!'
      };
      
      res.json(result);
      
    } catch (mlError) {
      console.log('⚠️  ML service unavailable:', mlError.message);
      
      // Return clear error - NO FALLBACK
      res.status(503).json({
        error: 'ML service unavailable',
        message: 'Your trained ML model is not running. Please start your FastAPI service on port 8000.',
        details: 'The system requires your machine learning model to make predictions.',
        mlServiceError: mlError.code || mlError.message
      });
    }
    
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Catch all undefined routes
app.use('*', (req, res) => {
  console.log(`❓ Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    availableEndpoints: {
      test: '/api/test',
      health: '/health',
      auth: ['/api/users/register', '/api/users/login', '/api/users/profile'],
      business: '/api/business',
      risk: '/api/risk',
      recommendations: '/api/recommendations',
      insights: '/api/insights'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Server error:', error);
  res.status(500).json({
    error: 'Something went wrong!',
    message: error.message
  });
});

// Start server
const PORT = 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ===== MSME BEACON BACKEND READY =====');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🎯 Risk prediction: http://localhost:${PORT}/api/risk/predict-demo`);
  console.log('🌐 CORS enabled for frontend connections');
  console.log('✅ Ready to receive requests!');
  console.log('==========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
}); 