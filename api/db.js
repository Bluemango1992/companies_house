// api/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB is already connected');
    return mongoose.connection;
  }

  // Use environment variable to choose the URI
  const mongoUri = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_URI_ATLAS 
    : process.env.MONGODB_URI_LOCAL;

  console.log(mongoUri);

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB (${process.env.NODE_ENV})`);
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectToDatabase;