const express = require('express');
const { createUser, getUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'DIRECTOR'));

router.route('/users')
  .post(createUser)
  .get(getUsers);

router.patch('/users/:id', toggleUserStatus);
router.get('/users/:id/logs', require('../controllers/adminController').getUserActivityLogs);

module.exports = router;
