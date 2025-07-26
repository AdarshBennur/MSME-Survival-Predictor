const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const mongoose = require('mongoose'); // Added missing import for mongoose

console.log('🚀 Starting MSME Beacon Backend Server...');

// Connect to MongoDB Atlas
connectDB()
  .then(conn => {
    if (conn) {
      console.log('✅ MongoDB connection successful!');
      console.log(`🏠 Connected to database: ${conn.connection.name}`);
      console.log(`🔌 Connection state: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    } else {
      console.error('⚠️ MongoDB connection returned null. Check your MONGODB_URI environment variable.');
    }
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    console.log('ℹ️  Server will continue running but database features will be unavailable');
  });

// Create Express app
const app = express();

// Enable CORS for all origins (development and production)
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://msme-survival-predictor.vercel.app',
    process.env.FRONTEND_URL // Allow the frontend URL from environment variable
  ].filter(Boolean), // Remove any undefined/null values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'Unknown'}`);
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
  
  // Check MongoDB connection status
  const dbStatus = {
    connected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
  };
  
  res.json({ 
    message: 'Backend server is running perfectly!', 
    timestamp: new Date().toISOString(),
    status: 'healthy',
    database: dbStatus,
    environment: {
      node_env: process.env.NODE_ENV || 'development',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      frontend_url: process.env.FRONTEND_URL || 'Not set'
    },
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

// MongoDB connection test route
app.get('/api/db-test', (req, res) => {
  console.log('📊 MongoDB connection test endpoint hit');
  
  // Check MongoDB connection status
  const dbStatus = {
    connected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
  };
  
  // Get MongoDB connection details
  const connectionDetails = {
    host: mongoose.connection.host || 'Not connected',
    name: mongoose.connection.name || 'Not connected',
    readyState: mongoose.connection.readyState,
    models: Object.keys(mongoose.models),
    mongodbUriSet: !!process.env.MONGODB_URI
  };
  
  if (dbStatus.connected) {
    // Try to perform a simple operation to verify connection is working
    try {
      // Count users collection documents
      mongoose.connection.db.collection('users').countDocuments()
        .then(count => {
          res.json({
            success: true,
            message: 'MongoDB connection is working properly',
            timestamp: new Date().toISOString(),
            dbStatus,
            connectionDetails,
            testOperation: {
              success: true,
              collection: 'users',
              documentCount: count
            }
          });
        })
        .catch(err => {
          res.json({
            success: false,
            message: 'MongoDB connection exists but operation failed',
            error: err.message,
            timestamp: new Date().toISOString(),
            dbStatus,
            connectionDetails,
            testOperation: {
              success: false,
              error: err.message
            }
          });
        });
    } catch (err) {
      res.json({
        success: false,
        message: 'MongoDB connection exists but test operation failed',
        error: err.message,
        timestamp: new Date().toISOString(),
        dbStatus,
        connectionDetails
      });
    }
  } else {
    res.json({
      success: false,
      message: 'MongoDB is not connected',
      timestamp: new Date().toISOString(),
      dbStatus,
      connectionDetails,
      possibleIssues: [
        'MONGODB_URI environment variable is not set correctly',
        'Network connectivity issues to MongoDB Atlas',
        'MongoDB Atlas IP whitelist restrictions',
        'Invalid credentials in connection string',
        'Database name in connection string is incorrect'
      ],
      troubleshooting: [
        'Check MONGODB_URI environment variable in Render dashboard',
        'Ensure MongoDB Atlas cluster is running',
        'Verify that your IP is whitelisted in MongoDB Atlas',
        'Check username and password in connection string'
      ]
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  // Check MongoDB connection status
  const dbStatus = {
    connected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
  };
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus
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
    
    // Get ML service URL from environment variable or use default
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    console.log(`🔗 Using ML service URL: ${ML_SERVICE_URL}/predict`);
    
    // Try to connect to ML service
    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, businessData, {
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
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ===== MSME BEACON BACKEND READY =====');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🧪 DB Test endpoint: http://localhost:${PORT}/api/db-test`);
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