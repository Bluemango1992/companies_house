import axios from 'axios';

const BASE_URL = 'https://developers.buymeacoffee.com/api/v1'; // Buy Me a Coffee API base URL
const API_KEY = process.env.REACT_APP_BMAC_API_KEY; // Make sure to add this key to your .env file

const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

// Get supporter donations
export const getSupporters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/supporters`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching supporters:', error);
    throw error;
  }
};

// Create a donation link (useful for custom actions)
export const createDonationLink = (amount, message) => {
  return `https://www.buymeacoffee.com/your-username?amount=${amount}&message=${message}`;
};