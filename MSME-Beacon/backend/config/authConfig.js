// Get JWT secret from environment variable or use a default for development only
const jwtSecret = process.env.JWT_SECRET;

// Check if JWT_SECRET is set in production
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  console.error('❌ JWT_SECRET environment variable is not set in production!');
  console.error('❌ This is a security risk. Please set a strong JWT_SECRET.');
}

// Get JWT expiration from environment variable or use default
const jwtExpire = process.env.JWT_EXPIRE || '30d';

// Export configuration
module.exports = {
  jwtSecret: jwtSecret || 'msme-survival-predictor-dev-secret-do-not-use-in-production',
  jwtExpire,
  saltRounds: 10 // For bcrypt password hashing
}; 