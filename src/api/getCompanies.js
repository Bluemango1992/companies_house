// api/getCompanies.js
import connectToDatabase from './db';
import Company from './models/Company'; // Assuming you move the models too

export default async (req, res) => {
  try {
    await connectToDatabase(); // Connect to the database

    const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;

    const nwLat = parseFloat(northWestLat);
    const nwLng = parseFloat(northWestLng);
    const seLat = parseFloat(southEastLat);
    const seLng = parseFloat(southEastLng);

    if (isNaN(nwLat) || isNaN(nwLng) || isNaN(seLat) || isNaN(seLng)) {
      return res.status(400).json({ message: 'Invalid coordinates provided' });
    }

    const query = {
      lat: { $gte: seLat, $lte: nwLat },
      lng: { $gte: nwLng, $lte: seLng }
    };

    const companies = await Company.find(query);

    res.status(200).json(companies);
  } catch (error) {
    console.error('Error in getCompanies route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};