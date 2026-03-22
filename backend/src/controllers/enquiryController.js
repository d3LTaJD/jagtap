const Enquiry = require('../models/Enquiry');
const Customer = require('../models/Customer');
const { createNotification, notifyRoles } = require('../services/notificationService');
const ActivityLog = require('../models/ActivityLog');

exports.createEnquiry = async (req, res, next) => {
  try {
    const { customerData, enquiryData } = req.body;
    
    // Auto-create or find existing customer
    let customer;
    if (customerData._id) {
      customer = await Customer.findById(customerData._id);
    } else {
      // Auto-generate unique customerId
      customerData.customerId = `CUS-${Date.now().toString().slice(-6)}`;
      customer = await Customer.create(customerData);
    }

    enquiryData.customer = customer._id;
    enquiryData.createdBy = req.user._id;
    enquiryData.assignedTo = enquiryData.assignedTo || req.user._id;
    
    // Generate simple ID logic
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    enquiryData.enquiryId = `ENQ-${year}-${month}-${Math.floor(Math.random() * 10000)}`;

    const enquiry = await Enquiry.create(enquiryData);

    if (enquiry.assignedTo && enquiry.assignedTo.toString() !== req.user._id.toString()) {
      await createNotification({ 
        user_id: enquiry.assignedTo, 
        type: 'ENQUIRY_ASSIGNED', 
        title: 'New Enquiry Assigned', 
        message: `Enquiry ${enquiry.enquiryId} has been assigned to you.`, 
        related_id: enquiry._id 
      });
    }

    res.status(201).json({ status: 'success', data: { enquiry, customer } });
  } catch (err) {
    next(err);
  }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('customer', 'companyName primaryContactName mobileNumber')
      .populate('assignedTo', 'fullName')
      .populate('files')
      .sort('-createdAt');
    res.status(200).json({ status: 'success', results: enquiries.length, data: { enquiries } });
  } catch (err) {
    next(err);
  }
};

exports.getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('customer')
      .populate('assignedTo', 'fullName')
      .populate('createdBy', 'fullName')
      .populate('files');
    
    if (!enquiry) return res.status(404).json({ status: 'error', message: 'Enquiry not found' });
    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) {
    next(err);
  }
};

exports.updateEnquiry = async (req, res, next) => {
  try {
    req.body.lastModifiedBy = req.user._id;
    const originalEnquiry = await Enquiry.findById(req.params.id);
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (req.body.status && req.body.status !== originalEnquiry.status) {
      await ActivityLog.create({
        user_id: req.user._id,
        action: 'STATUS_CHANGE',
        module: 'ENQUIRY',
        details: `Enquiry ${enquiry.enquiryId} status changed from ${originalEnquiry.status} to ${req.body.status}`,
        related_id: enquiry._id
      });
    }

    if (req.body.assignedTo && req.body.assignedTo.toString() !== originalEnquiry.assignedTo?.toString()) {
      await ActivityLog.create({
        user_id: req.user._id,
        action: 'ASSIGNMENT',
        module: 'ENQUIRY',
        details: `Enquiry ${enquiry.enquiryId} assigned to ${req.body.assignedTo}`,
        related_id: enquiry._id
      });
      await createNotification({ 
        user_id: req.body.assignedTo, 
        type: 'ENQUIRY_ASSIGNED', 
        title: 'Enquiry Reassigned', 
        message: `Enquiry ${enquiry.enquiryId} was assigned to you.`, 
        related_id: enquiry._id 
      });
    }

    if (req.body.status && req.body.status !== originalEnquiry.status && enquiry.assignedTo) {
      // Notify the assigned user of status change if they didn't make it
      if (enquiry.assignedTo.toString() !== req.user._id.toString()) {
        await createNotification({ 
          user_id: enquiry.assignedTo, 
          type: 'SYSTEM', 
          title: 'Enquiry Status Changed', 
          message: `Enquiry ${enquiry.enquiryId} is now ${req.body.status}.`, 
          related_id: enquiry._id 
        });
      }
    }

    res.status(200).json({ status: 'success', data: { enquiry } });
  } catch (err) {
    next(err);
  }
};
