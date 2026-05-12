const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendorType: { type: String, enum: ['Supplier', 'Contractor', 'Service Provider', 'Logistics'], default: 'Supplier' },
  contactPerson: { type: String },
  mobile: { type: String },
  email: { type: String },
  
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  
  gstNumber: { type: String },
  panNumber: { type: String },
  msmeRegNumber: { type: String },
  
  paymentTerms: { type: String },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },

  status: { type: String, enum: ['Active', 'Inactive', 'Blacklisted'], default: 'Active' },
  rating: { type: Number, min: 1, max: 5 },
  
  dynamicFields: { type: mongoose.Schema.Types.Mixed, default: {} },
  notes: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

vendorSchema.index({ name: 1 });
vendorSchema.index({ status: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
