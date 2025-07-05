module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'msme-survival-predictor-secret',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  saltRounds: 10 // For bcrypt password hashing
}; 