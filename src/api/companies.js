// src/api/companies.js
import mongoose from 'mongoose';
import Company from './models/Company.js';

const mongoUri = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI_ATLAS
  : process.env.MONGODB_URI_LOCAL;

let isConnected = false; // To track the MongoDB connection state

const connectToDatabase = async () => {
  if (!isConnected) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  }
};

export default async function handler(req, res) {
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
      console.error('Error in POST /companies:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;
      
      if (!northWestLat || !northWestLng || !southEastLat || !southEastLng) {
        return res.status(400).json({ message: 'Missing coordinates' });
      }

      const query = {
        lat: { $gte: parseFloat(southEastLat), $lte: parseFloat(northWestLat) },
        lng: { $gte: parseFloat(northWestLng), $lte: parseFloat(southEastLng) },
      };

      const companies = await Company.find(query);

      return res.status(200).json(companies);
    } catch (error) {
      console.error('Error in GET /companies:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
