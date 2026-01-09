const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    if (!config.mongodb.uri) {
      throw new Error('MongoDB URI is missing!');
    }

    const conn = await mongoose.connect(config.mongodb.uri); // no options needed in v7+
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
