// api/postCompanies.js
import connectToDatabase from './db';
import Company from './models/Company';

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://companies-house-three.vercel.app' 
    : 'http://localhost:5173');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight request
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const newCompanies = req.body; // Assuming newCompanies are sent in the request body

    // Retrieve all existing companies from the database
    const existingCompanies = await Company.find({}, 'company_number'); // Fetch only the 'company_number' field

    // Extract the company numbers from the existing companies
    const existingCompanyNumbers = new Set(existingCompanies.map(company => company.company_number));

    // Filter out duplicates based on company_number
    const uniqueNewCompanies = newCompanies.filter(company => !existingCompanyNumbers.has(company.company_number));

    if (uniqueNewCompanies.length > 0) {
      // Insert the new unique companies into the MongoDB collection
      await Company.insertMany(uniqueNewCompanies);
      res.status(200).json({ message: `Added ${uniqueNewCompanies.length} new companies to MongoDB.` });
    } else {
      res.status(200).json({ message: 'No new companies to add.' });
    }
  } catch (err) {
    console.error('Error adding companies:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
