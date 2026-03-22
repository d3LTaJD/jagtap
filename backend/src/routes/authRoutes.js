const express = require('express');
const {
  login, verifyToken, setPassword, forgotPassword,
  getAllUsers, updateProfile, changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/set-password', setPassword);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.use(protect);
router.get('/users', getAllUsers);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);

module.exports = router;
