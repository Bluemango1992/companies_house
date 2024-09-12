// api/getCompanyByNumber.js
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { company_number } = req.query; // Get company_number from URL parameter

    if (!company_number) {
      return res.status(400).json({ message: 'Company number is required' });
    }

    // Query MongoDB to find the company by its company_number
    const company = await Company.findOne({ company_number });

    if (!company) {
      // If no company is found, return a 404 response
      return res.status(404).json({ message: 'Company not found' });
    }

    // If the company is found, return it as a JSON response
    res.status(200).json(company);
  } catch (err) {
    console.error('Error querying company:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
