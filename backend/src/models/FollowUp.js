const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  enquiry:     { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', required: true, index: true },
  type: {
    type: String,
    enum: ['CALL', 'EMAIL', 'MEETING', 'SITE_VISIT', 'WHATSAPP', 'NOTE', 'ESCALATION', 'REMINDER'],
    default: 'NOTE'
  },
  notes:       { type: String, required: true },
  outcome:     { type: String }, // What happened after the follow-up
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Scheduling
  followUpDate:     { type: Date }, // When this follow-up happened
  nextFollowUpDate: { type: Date }, // Reminder: when to follow up next

  // Escalation / Reminder
  isReminder:       { type: Boolean, default: false },
  reminderSent:     { type: Boolean, default: false },
  isOverridden:     { type: Boolean, default: false }, // Super Admin / Director override
  overriddenBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  overrideNote:     { type: String },

  // Escalation flags
  isEscalation:     { type: Boolean, default: false },
  escalatedTo:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
