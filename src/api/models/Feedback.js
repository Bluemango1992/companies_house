import mongoose from 'mongoose';

// Define a Feedback schema
const feedbackSchema = new mongoose.Schema({
    feedback: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Create a Feedback model
  const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;