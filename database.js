const mongoose = require('mongoose');

// MongoDB connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Retry connection after 5 seconds if the initial connection fails
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
