const mongoose = require('mongoose');
require('dotenv').config();

// Function to connect to MongoDB Atlas
const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI
    const MONGO_URI = process.env.MONGODB_URI;
    
    if (!MONGO_URI) {
      console.error('❌ MONGODB_URI environment variable not set!');
      console.error('❌ Please set the MONGODB_URI environment variable in your Render dashboard.');
      console.error('❌ Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
      return null;
    }
    
    // Check if the URI is valid
    if (!MONGO_URI.startsWith('mongodb+srv://') && !MONGO_URI.startsWith('mongodb://')) {
      console.error('❌ Invalid MongoDB URI format!');
      console.error('❌ URI should start with mongodb+srv:// or mongodb://');
      return null;
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB with improved options
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4 // Use IPv4, avoid IPv6 issues
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
    
    // Handle Node.js process termination and close the connection
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing Mongoose connection:', err);
        process.exit(1);
      }
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB Atlas: ${error.message}`);
    
    // Provide detailed troubleshooting based on error message
    if (error.message.includes('ENOTFOUND') || error.message.includes('failed to connect')) {
      console.error('🔍 Troubleshooting Tips:');
      console.error('   - Check your internet connection');
      console.error('   - Ensure your IP is whitelisted in MongoDB Atlas');
      console.error('   - Verify the connection string is correct');
      console.error('   - Check if the cluster is running');
    }
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed - check username and password in your connection string');
    }
    if (error.message.includes('bad auth')) {
      console.error('🔐 Bad auth - ensure your username and password do not contain special characters that need URL encoding');
    }
    if (error.name === 'MongooseServerSelectionError') {
      console.error('⏱️ Server selection timeout - MongoDB Atlas may be down or unreachable');
      console.error('   - Check MongoDB Atlas status: https://status.mongodb.com/');
      console.error('   - Ensure your IP is whitelisted in MongoDB Atlas');
    }
    
    // Log the full error for debugging
    console.error('Full error object:', error);
    
    return Promise.reject(error);
  }
};

// Export the connection function
module.exports = connectDB; 