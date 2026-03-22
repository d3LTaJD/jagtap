const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  itemNo: Number,
  description: String,
  productCategory: String,
  materialGrade: String,
  applicableStandard: String,
  quantity: Number,
  unit: String,
  unitPrice: Number,
  testingCharges: Number,
  inspectionCharges: Number,
  discountPercent: Number,
  lineTotalExclGST: Number,
  gstRate: Number,
  gstAmount: Number,
  lineTotalInclGST: Number,
  testsRequired: [{ type: String }],
  manufacturingProcess: String,
  deliveryWeeks: Number,
  technicalDeviations: String
});

const quotationSchema = new mongoose.Schema({
  quotationId: { type: String, unique: true }, // QT-YYYY-MM-NNNN
  costSummary: { type: mongoose.Schema.Types.Mixed },
  
  attachments: [{ type: String }],
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileMetadata' }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  revisionNumber: { type: Number, default: 0 },
  revisionReason: String,
  
  status: { 
    type: String, 
    enum: ['DRAFT', 'TECH_REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'Draft', 'Pending Technical Review', 'Pending Commercial Review', 'Sent', 'Accepted', 'Negotiating', 'Revised', 'Expired'],
    default: 'DRAFT'
  },

  preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technicalReviewBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  scopeOfSupply: String,
  exclusions: String,
  deliverySchedule: String,
  currency: { type: String, default: 'INR' },
  
  items: [quotationItemSchema],

  commercialTotals: {
    subtotalExclGST: Number,
    totalTestingCharges: Number,
    totalInspectionCharges: Number,
    freightCharges: Number,
    totalGST: Number,
    grandTotal: Number
  },

  paymentTerms: String,
  advancePercent: Number,
  specialCommercialNotes: String,
  
  validUntil: Date
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
