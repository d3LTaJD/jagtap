const express = require('express');
const { protect, requirePermission } = require('../middleware/auth');
const { generateQapFromQuotation, getQaps, getQap, updateQapStatus } = require('../controllers/qapController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(requirePermission('QAP', 'view'), getQaps)
  .post(requirePermission('QAP', 'create'), generateQapFromQuotation);

router.route('/:id')
  .get(requirePermission('QAP', 'view'), getQap);

router.route('/:id/status')
  .patch(requirePermission('QAP', 'edit'), updateQapStatus);

module.exports = router;
