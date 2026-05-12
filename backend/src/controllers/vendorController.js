const Vendor = require('../models/Vendor');
const { logActivity } = require('../utils/logger');

exports.createVendor = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const vendor = await Vendor.create(req.body);

    await logActivity({
      req,
      action: 'CREATE',
      module: 'VENDOR',
      resourceId: vendor._id,
      resourceName: vendor.name,
      newState: vendor.toObject(),
      details: `Created vendor: ${vendor.name}`
    });

    res.status(201).json({ status: 'success', data: { vendor } });
  } catch (err) { next(err); }
};

exports.getVendors = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contactPerson': { $regex: search, $options: 'i' } },
        { 'email': { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const vendors = await Vendor.find(query).sort('-createdAt');
    res.status(200).json({ status: 'success', results: vendors.length, data: { vendors } });
  } catch (err) { next(err); }
};

exports.getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ status: 'error', message: 'Vendor not found' });
    res.status(200).json({ status: 'success', data: { vendor } });
  } catch (err) { next(err); }
};

exports.updateVendor = async (req, res, next) => {
  try {
    req.body.lastModifiedBy = req.user._id;
    const originalVendor = await Vendor.findById(req.params.id);
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ status: 'error', message: 'Vendor not found' });

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'VENDOR',
      resourceId: vendor._id,
      resourceName: vendor.name,
      previousState: originalVendor.toObject(),
      newState: vendor.toObject(),
      details: `Updated vendor: ${vendor.name}`
    });

    res.status(200).json({ status: 'success', data: { vendor } });
  } catch (err) { next(err); }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ status: 'error', message: 'Vendor not found' });
    
    await Vendor.findByIdAndDelete(req.params.id);

    await logActivity({
      req,
      action: 'DELETE',
      module: 'VENDOR',
      resourceId: vendor._id,
      resourceName: vendor.name,
      previousState: vendor.toObject(),
      newState: null,
      details: `Deleted vendor: ${vendor.name}`
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
