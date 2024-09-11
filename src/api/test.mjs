import got from 'got';

// The company number you want to query
const companyNumber = '00944270';

// The URL to the API endpoint
const url = `http://localhost:3000/companies/${companyNumber}`;

async function getCompanyData() {
  try {
    // Make a GET request to the API
    const response = await got(url, { responseType: 'json' });
    
    // Log the company data
    console.log('Company Data:', response.body);
  } catch (error) {
    // Handle any errors (e.g., if the company is not found)
    console.error('Error fetching company data:', error.response?.body || error.message);
  }
}

// Call the function to fetch and log the company data
getCompanyData();