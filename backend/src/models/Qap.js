const mongoose = require('mongoose');

const inspectionActivitySchema = new mongoose.Schema({
  activityNo: Number,
  stageOfManufacture: String,
  activityName: String,
  referenceDocument: String,
  acceptanceCriteria: String,
  inspectionAgency: String,
  tpiAgencyName: String,
  inspectionType: { type: String, enum: ['H', 'W', 'R', 'I'] }, 
  recordType: String,
  frequency: String,
  responsibleParty: String,
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed', 'Waived', 'N/A'], default: 'Planned' },
  completionDate: Date,
  resultReference: String,
  remarks: String
});

const documentChecklistSchema = new mongoose.Schema({
  documentType: String,
  documentReferenceNo: String,
  status: { type: String, enum: ['Awaited', 'Received', 'Under Review', 'Accepted', 'Rejected'], default: 'Awaited' },
  receivedDate: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: String
});

const qapSchema = new mongoose.Schema({
  qapId: { type: String, unique: true }, // QAP-YYYY-MM-NNNN
  quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  revision: { type: Number, default: 0 },
  
  status: { 
    type: String, 
    enum: ['GENERATED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'Draft', 'QC Review', 'Pending Director Approval', 'Sent to Client', 'Revised'],
    default: 'GENERATED' 
  },

  preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  directorSignatureUrl: String,

  activities: [inspectionActivitySchema],
  documents: [documentChecklistSchema],

  sentToClientDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Qap', qapSchema);
