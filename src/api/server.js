// server.js (local development)

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Company from './models/Company.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI_LOCAL;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connected to MongoDB in development environment`);
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define API route for companies
app.get('/companies', async (req, res) => {
  const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;
  if (!northWestLat || !northWestLng || !southEastLat || !southEastLng) {
    return res.status(400).json({ message: 'Missing coordinates' });
  }
  const query = {
    lat: { $gte: parseFloat(southEastLat), $lte: parseFloat(northWestLat) },
    lng: { $gte: parseFloat(northWestLng), $lte: parseFloat(southEastLng) },
  };
  const companies = await Company.find(query);
  res.json(companies);
});

// Start local development server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Development server running on port ${PORT}`);
});
