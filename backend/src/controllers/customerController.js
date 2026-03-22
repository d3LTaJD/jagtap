const Customer = require('../models/Customer');

// Pad number for auto ID: CUS-0001
const padId = (n) => `CUS-${String(n).padStart(4, '0')}`;

// GET /api/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, isActive } = req.query;
    const filter = {};
    if (search) filter.companyName = { $regex: search, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const customers = await Customer.find(filter).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { customers } });
  } catch (err) { next(err); }
};

// GET /api/customers/:id
exports.getCustomer = async (req, res, next) => {
  try {
    const cust = await Customer.findById(req.params.id);
    if (!cust) return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    res.status(200).json({ status: 'success', data: { customer: cust } });
  } catch (err) { next(err); }
};

// POST /api/customers
exports.createCustomer = async (req, res, next) => {
  try {
    const count = (await Customer.countDocuments()) + 1;
    const customerId = padId(count);
    const customer = await Customer.create({ ...req.body, customerId });
    res.status(201).json({ status: 'success', data: { customer } });
  } catch (err) { next(err); }
};

// PATCH /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ status: 'fail', message: 'Customer not found' });
    res.status(200).json({ status: 'success', data: { customer } });
  } catch (err) { next(err); }
};

// DELETE /api/customers/:id  (soft delete — set isActive false)
exports.deleteCustomer = async (req, res, next) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ status: 'success', message: 'Customer deactivated' });
  } catch (err) { next(err); }
};
