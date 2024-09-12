// api/getCompanies.js
import connectToDatabase from './db.js';
import Company from './models/Company.js';

export default async (req, res) => {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;

    // Convert string parameters to numbers
    const nwLat = parseFloat(northWestLat);
    const nwLng = parseFloat(northWestLng);
    const seLat = parseFloat(southEastLat);
    const seLng = parseFloat(southEastLng);

    // Validate coordinates
    if (isNaN(nwLat) || isNaN(nwLng) || isNaN(seLat) || isNaN(seLng)) {
      return res.status(400).json({ message: 'Invalid coordinates provided' });
    }

    const query = {
      lat: { $gte: seLat, $lte: nwLat },
      lng: { $gte: nwLng, $lte: seLng },
    };

    // Fetch companies within bounds
    const companies = await Company.find(query);

    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
