import mongoose from 'mongoose';

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

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
