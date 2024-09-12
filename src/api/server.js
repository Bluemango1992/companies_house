// server.js
import express from 'express';
import cors from 'cors';
import connectToDatabase from './db.js';

const app = express();

// Use CORS to allow your frontend to access the API
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// Import your API routes
import getCompanies from './getCompanies.js';
import getCompanyByNumber from './getCompanyByNumber.js';
import postCompanies from './postCompanies.js';
import postFeedback from './postFeedback.js';

// API Endpoints
app.get('/api/companies', getCompanies);
app.get('/api/companies/:company_number', getCompanyByNumber);
app.post('/api/companies', postCompanies);
app.post('/api/feedback', postFeedback);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
