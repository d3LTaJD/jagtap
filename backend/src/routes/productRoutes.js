const express = require('express');
const productController = require('../controllers/productController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(requirePermission('Products', 'view'), productController.getProducts)
  .post(requirePermission('Products', 'create'), productController.createProduct);

router.route('/:id')
  .get(requirePermission('Products', 'view'), productController.getProduct)
  .put(requirePermission('Products', 'edit'), productController.updateProduct)
  .delete(requirePermission('Products', 'delete'), productController.deleteProduct);

module.exports = router;
