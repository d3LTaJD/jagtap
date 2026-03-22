const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'Super Admin', 'Director', 'Sales Executive'
  code: { type: String, required: true, unique: true }, // e.g., 'SA', 'DIR', 'SALES'
  description: { type: String },
  department: { type: String, enum: ['Sales', 'Design', 'QC', 'Purchase', 'Accounts', 'Production', 'Management', 'Admin'] },
  permissions: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // Store module-level actions: e.g. { enquiry: { create: true, edit: false } }
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
