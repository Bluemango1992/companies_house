import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' })

const mongoUri = process.env.MONGODB_URI_ATLAS;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    mongoose.connection.close();  // Close the connection after successful test
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
