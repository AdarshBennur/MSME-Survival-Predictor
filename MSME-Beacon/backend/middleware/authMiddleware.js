const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Check if we can safely import User model
let User = null;
let authConfig = null;

try {
  User = require('../models/User');
  authConfig = require('../config/authConfig');
} catch (error) {
  console.warn('⚠️  Auth models not available (database issue)');
}

// Middleware to protect routes
const protect = async (req, res, next) => {
  // If database is not connected, skip auth for demo purposes
  if (mongoose.connection.readyState !== 1 || !User || !authConfig) {
    console.warn('⚠️  Auth bypassed - database not connected');
    req.user = { id: 'demo-user', email: 'demo@example.com' }; // Mock user for demo
    return next();
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

      // Verify token
      const decoded = jwt.verify(token, authConfig.jwtSecret);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

module.exports = { protect }; 