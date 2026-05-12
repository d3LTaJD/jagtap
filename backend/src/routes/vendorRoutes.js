const express = require('express');
const vendorController = require('../controllers/vendorController');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(requirePermission('Admin', 'view'), vendorController.getVendors)
  .post(requirePermission('Admin', 'create'), vendorController.createVendor);

router.route('/:id')
  .get(requirePermission('Admin', 'view'), vendorController.getVendor)
  .put(requirePermission('Admin', 'edit'), vendorController.updateVendor)
  .delete(requirePermission('Admin', 'delete'), vendorController.deleteVendor);

module.exports = router;
