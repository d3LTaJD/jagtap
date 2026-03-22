const express = require('express');
const followUpController = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(followUpController.getFollowUps)
  .post(followUpController.addFollowUp);

router.route('/:id')
  .patch(followUpController.updateFollowUp)
  .delete(followUpController.deleteFollowUp);

module.exports = router;
