const mongoose = require('mongoose');
require('dotenv').config();

// Function to connect to MongoDB Atlas
const connectDB = async () => {
  try {
    // Use environment variable or fallback to direct connection string with explicit database name
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://adimsme:msme000@msme.bvlwyvs.mongodb.net/test?retryWrites=true&w=majority&appName=msme';
    
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`📝 Using Existing Collections: users (for credentials), businesses, insights`);
    
    // Listen for connection events
    mongoose.connection.on('connected', () => {
      console.log('🔌 Mongoose connected to MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB Atlas');
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB Atlas: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('failed to connect')) {
      console.error('🔍 Troubleshooting Tips:');
      console.error('   - Check your internet connection');
      console.error('   - Ensure your IP is whitelisted in MongoDB Atlas');
      console.error('   - Verify the connection string is correct');
      console.error('   - Check if the cluster is running');
    }
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed - check username and password');
    }
    return Promise.reject(error);
  }
};

module.exports = connectDB; 