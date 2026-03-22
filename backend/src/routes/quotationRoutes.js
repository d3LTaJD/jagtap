const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const quotationController = require('../controllers/quotationController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(quotationController.getQuotations) // Changed to use quotationController object
  .post(quotationController.createQuotation); // Changed to use quotationController object

router.route('/:id')
  .get(quotationController.getQuotation)
  .delete(authorize('SA', 'SUPER_ADMIN', 'DIRECTOR'), quotationController.deleteQuotation);

router.patch('/:id/status', quotationController.updateQuotationStatus); // Changed route definition style and used quotationController object
router.post('/:id/generate-pdf', quotationController.generatePdf); // Added new route

router.route('/:id/pdf')
  .get(quotationController.downloadPDF); // Changed to use quotationController object

module.exports = router;
