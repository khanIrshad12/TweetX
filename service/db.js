const mongoose = require('mongoose');

const uri = process.env.MONGODB_URL;

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }
  
  const connectToDatabase = async () => {
   
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
      });

      console.log('Connected to database');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw new Error('Failed to connect to database');
    }
  };
  
  module.exports = connectToDatabase;
  