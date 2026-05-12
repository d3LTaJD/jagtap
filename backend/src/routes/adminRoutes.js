const express = require('express');
const { createUser, getUsers, toggleUserStatus, editUser, resetUserPassword } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'DIRECTOR', 'SA', 'DIR'));

router.route('/users')
  .post(createUser)
  .get(getUsers);

router.route('/users/:id')
  .patch(toggleUserStatus)
  .put(editUser)
  .delete(require('../controllers/adminController').deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);
router.get('/users/:id/logs', require('../controllers/adminController').getUserActivityLogs);
router.get('/logs', require('../controllers/adminController').getAllActivityLogs);

module.exports = router;
