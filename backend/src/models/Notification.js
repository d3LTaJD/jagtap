const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'ENQUIRY_ASSIGNED', 'FOLLOWUP_REMINDER', 'FOLLOWUP_OVERDUE',
      'QUOTE_APPROVAL', 'QUOTATION_ASSIGNED', 'QUOTATION_APPROVED',
      'QAP_APPROVAL', 'ESCALATION', 'INFO', 'SYSTEM'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  related_id: { type: mongoose.Schema.Types.ObjectId, required: false },
  is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Notification', notificationSchema);
