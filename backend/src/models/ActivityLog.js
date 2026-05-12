const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  // Keep original field names for backward compatibility with existing data
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },   // CREATE, UPDATE, DELETE, LOGIN, STATUS_CHANGE, ASSIGNMENT, TOGGLE_USER_STATUS, etc.
  module: { type: String, required: true },   // AUTH, ENQUIRY, QUOTATION, QAP, USER, TASK, SETTINGS, MASTER_DATA
  details: { type: String },
  related_id: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },

  // ─── New Audit Fields (added for diff tracking) ───────────────
  resourceName: { type: String },             // e.g. "ENQ-2026-03-001"
  previousState: { type: mongoose.Schema.Types.Mixed },
  newState: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
});

// Indexes for fast lookups
activityLogSchema.index({ module: 1, related_id: 1 });
activityLogSchema.index({ user_id: 1 });
activityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
