const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Check if we can safely import User model
let User = null;
let authConfig = null;

try {
  User = require('../models/User');
  authConfig = require('../config/authConfig');
} catch (error) {
  console.warn('⚠️  Auth models not available (database issue):', error.message);
}

// Middleware to protect routes
const protect = async (req, res, next) => {
  // Check MongoDB connection status
  const isDbConnected = mongoose.connection.readyState === 1;
  
  if (!isDbConnected) {
    console.error('❌ MongoDB not connected - auth middleware cannot function properly');
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again later.',
      error: 'database_unavailable'
    });
  }
  
  // Check if User model and authConfig are available
  if (!User || !authConfig) {
    console.error('❌ User model or authConfig not available');
    return res.status(503).json({
      success: false,
      message: 'Authentication service unavailable. Please try again later.',
      error: 'auth_service_unavailable'
    });
  }

  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        console.error('❌ Token is empty or malformed');
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, token is empty or malformed',
          error: 'invalid_token_format'
        });
      }

      // Verify token
      try {
        const decoded = jwt.verify(token, authConfig.jwtSecret);
        
        // Get user from the token (exclude password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          console.error(`❌ User not found for token ID: ${decoded.id}`);
          return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, user not found',
            error: 'user_not_found'
          });
        }

        // Add user to request
        req.user = user;
        console.log(`✅ Auth successful for user: ${user.email}`);
        next();
      } catch (jwtError) {
        console.error('❌ JWT verification failed:', jwtError.message);
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, token invalid or expired',
          error: 'invalid_token'
        });
      }
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      res.status(401).json({ 
        success: false, 
        message: 'Authentication error',
        error: error.message
      });
    }
  } else {
    console.error('❌ No authorization header or token provided');
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided',
      error: 'missing_token'
    });
  }
};

module.exports = { protect }; 