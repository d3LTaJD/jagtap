const express = require('express');
const { protect } = require('../middleware/auth');
const { createEnquiry, getEnquiries, getEnquiry, updateEnquiry } = require('../controllers/enquiryController');
const followUpRouter = require('./followUpRoutes');

const router = express.Router();

// Require login to access any enquiry routes
router.use(protect);

// Mount nested routers
router.use('/:enquiryId/followups', followUpRouter);

router.route('/')
  .get(getEnquiries)
  .post(createEnquiry);

router.route('/:id')
  .get(getEnquiry)
  .patch(updateEnquiry);

module.exports = router;
