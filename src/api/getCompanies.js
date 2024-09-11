// src/api/getCompanies.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const uri = process.env.MONGODB_URI;
  
  // Initialize the MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and collection
    const database = client.db('bluechipuk');
    const companies = database.collection('companies');

    // Query for the first 10 companies
    const result = await companies.find({}).limit(10).toArray();

    // Return the result as a response
    res.status(200).json(result);
    console.log('Companies fetched successfully');
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  } finally {
    await client.close();
  }
}