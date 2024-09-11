import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/bluechipuk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


// Define a Company schema
const companySchema = new mongoose.Schema({
  name: String,
  company_number: String,
  sic_codes: [String],
  address: {
    line_1: String,
    line_2: String,
    locality: String,
    postal_code: String,
    region: String
  },
  lat: Number,
  lng: Number
});

// Create a Company model
const Company = mongoose.model('Company', companySchema);

// POST route to add new companies
app.post('/companies', async (req, res) => {
  const newCompanies = req.body; // Assuming newCompanies are sent in the request body

  try {
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
});

// Define the GET route to query by company_number
app.get('/companies/:company_number', async (req, res) => {
  const { company_number } = req.params; // Get company_number from URL parameter

  try {
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
});

// GET route to fetch companies (as you had before)
app.get('/companies', async (req, res) => {
  try {
    const { northWestLat, northWestLng, southEastLat, southEastLng } = req.query;

    // Convert string parameters to numbers
    const nwLat = parseFloat(northWestLat);
    const nwLng = parseFloat(northWestLng);
    const seLat = parseFloat(southEastLat);
    const seLng = parseFloat(southEastLng);

    // Validate the parameters
    if (isNaN(nwLat) || isNaN(nwLng) || isNaN(seLat) || isNaN(seLng)) {
      return res.status(400).json({ message: 'Invalid coordinates provided' });
    }

    const query = {
      lat: { $gte: seLat, $lte: nwLat },
      lng: { $gte: nwLng, $lte: seLng }
    };

    const companies = await Company.find(query);

    res.json(companies);
  } catch (error) {
    console.error('Error in /companies route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
