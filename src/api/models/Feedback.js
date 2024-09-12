import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
