const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, sparse: true },     // CUS-NNNN
  companyName: { type: String, required: true },
  customerType: { type: String, enum: ['Government', 'Private', 'Export', 'Trader', 'EPC', 'End User', ''], default: '' },
  primaryContactName: { type: String, required: true },
  designation: { type: String },
  mobileNumber: { type: String, required: true },
  alternateMobile: { type: String },
  emailAddress: { type: String },
  alternateEmail: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  gstin: { type: String },                                      // 15-char GST
  pan: { type: String },                                        // 10-char PAN
  paymentTerms: { type: String, enum: ['Advance', '30 days', '45 days', '60 days', 'LC', 'Against Delivery', ''], default: '' },
  creditLimit: { type: Number, default: 0 },                    // INR — for accounts visibility
  sourceChannel: { type: String },
  tags: [{ type: String }],
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
