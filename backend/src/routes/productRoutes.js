const express = require('express');
const productController = require('../controllers/productController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(requirePermission('Admin', 'view'), productController.getProducts)
  .post(requirePermission('Admin', 'create'), productController.createProduct);

router.route('/:id')
  .get(requirePermission('Admin', 'view'), productController.getProduct)
  .put(requirePermission('Admin', 'edit'), productController.updateProduct)
  .delete(requirePermission('Admin', 'delete'), productController.deleteProduct);

module.exports = router;
