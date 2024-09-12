// api/db.js
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return mongoose.connection;
  }
  
  // Use environment variable to choose the URI
  const mongoUri = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_URI_ATLAS 
    : process.env.MONGODB_URI_LOCAL;

  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectToDatabase;