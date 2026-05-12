const Product = require('../models/Product');
const { logActivity } = require('../utils/logger');

exports.createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const product = await Product.create(req.body);

    await logActivity({
      req,
      action: 'CREATE',
      module: 'PRODUCT',
      resourceId: product._id,
      resourceName: product.name,
      newState: product.toObject(),
      details: `Created product: ${product.name}`
    });

    res.status(201).json({ status: 'success', data: { product } });
  } catch (err) { next(err); }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const products = await Product.find(query).sort('-createdAt');
    res.status(200).json({ status: 'success', results: products.length, data: { products } });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    req.body.lastModifiedBy = req.user._id;
    const originalProduct = await Product.findById(req.params.id);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

    await logActivity({
      req,
      action: 'UPDATE',
      module: 'PRODUCT',
      resourceId: product._id,
      resourceName: product.name,
      previousState: originalProduct.toObject(),
      newState: product.toObject(),
      details: `Updated product: ${product.name}`
    });

    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    
    await Product.findByIdAndDelete(req.params.id);

    await logActivity({
      req,
      action: 'DELETE',
      module: 'PRODUCT',
      resourceId: product._id,
      resourceName: product.name,
      previousState: product.toObject(),
      newState: null,
      details: `Deleted product: ${product.name}`
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
