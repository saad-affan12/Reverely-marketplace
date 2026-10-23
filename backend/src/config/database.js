const mongoose = require('mongoose');

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });

    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB connection disconnected.');
    });

    return conn;
  } catch (error) {
    console.error(`[Database] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDatabase };
