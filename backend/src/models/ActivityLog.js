const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // LOGIN, LOGOUT, UPDATE_STATUS, ASSIGN_TASK, etc.
  module: { type: String, required: true }, // AUTH, ENQUIRY, QUOTATION, QAP, USER
  details: { type: String },
  related_id: { type: mongoose.Schema.Types.ObjectId }, // ID of the enquiry/quotation involved
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
