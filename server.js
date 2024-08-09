import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/companies_house');

const CompanySchema = new mongoose.Schema({
  CompanyNumber: String,
  CompanyName: String,
  Address: String,
  TotalScore: Number,
  Latitude: Number, // New field for latitude
  Longitude: Number, // New field for longitude
});

const Company = mongoose.model('Company', CompanySchema, 'southwest');

app.get('/companies', async (req, res) => {
  try {
    const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;

    console.log('Received query parameters:', req.query);

    // Convert string parameters to numbers
    const nwLat = parseFloat(northWestLat);
    const nwLng = parseFloat(northWestLng);
    const seLat = parseFloat(southEastLat);
    const seLng = parseFloat(southEastLng);

    console.log('Parsed coordinates:', { nwLat, nwLng, seLat, seLng });

    // Validate the parameters
    if (isNaN(nwLat) || isNaN(nwLng) || isNaN(seLat) || isNaN(seLng)) {
      return res.status(400).json({ message: 'Invalid coordinates provided' });
    }

    const query = {
      Latitude: { $gte: seLat, $lte: nwLat },
      Longitude: { $gte: nwLng, $lte: seLng }
    };

    console.log('Executing query:', query);

    const companies = await Company.find(query);

    console.log('Found companies:', companies.length);

    res.json(companies);
  } catch (error) {
    console.error('Error in /companies route:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
