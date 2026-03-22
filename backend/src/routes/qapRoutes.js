const express = require('express');
const { protect } = require('../middleware/auth');
const { generateQapFromQuotation, getQaps, getQap, updateQapStatus } = require('../controllers/qapController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getQaps)
  .post(generateQapFromQuotation);

router.route('/:id')
  .get(getQap);

router.route('/:id/status')
  .patch(updateQapStatus);

module.exports = router;
