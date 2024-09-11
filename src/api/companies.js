import mongoose from 'mongoose';
import Company from '../models/Company.js';  // Adjust the path if your models are not in the same directory

// Set the MongoDB URI based on the environment (production or development)
const mongoUri = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI_ATLAS
  : process.env.MONGODB_URI_LOCAL;

// Global variable to track the MongoDB connection state across function calls
let isConnected = false;

// Function to handle connection to MongoDB
const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Could not connect to the database.');
    }
  }
};

// Main handler function for the API route
export default async function handler(req, res) {
  // Connect to the database
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const newCompanies = req.body;
      
      // Retrieve existing companies
      const existingCompanies = await Company.find({}, 'company_number');
      const existingCompanyNumbers = new Set(existingCompanies.map(company => company.company_number));
      
      // Filter out duplicates
      const uniqueNewCompanies = newCompanies.filter(company => !existingCompanyNumbers.has(company.company_number));

      if (uniqueNewCompanies.length > 0) {
        await Company.insertMany(uniqueNewCompanies);
        return res.status(200).json({ message: `Added ${uniqueNewCompanies.length} new companies.` });
      } else {
        return res.status(200).json({ message: 'No new companies to add.' });
      }
    } catch (error) {
      console.error('Error in POST /api/companies:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;

      // Validate query parameters
      if (!northWestLat || !northWestLng || !southEastLat || !southEastLng) {
        return res.status(400).json({ message: 'Missing or invalid coordinates' });
      }

      // Construct the query to filter companies within the given bounds
      const query = {
        lat: { $gte: parseFloat(southEastLat), $lte: parseFloat(northWestLat) },
        lng: { $gte: parseFloat(northWestLng), $lte: parseFloat(southEastLng) },
      };

      const companies = await Company.find(query);

      return res.status(200).json(companies);
    } catch (error) {
      console.error('Error in GET /api/companies:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Return a 405 response if the method is not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }
}