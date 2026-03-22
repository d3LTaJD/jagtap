const User = require('../models/User');
const Token = require('../models/Token');
const otpUtils = require('../utils/otp');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create new user (Admin only)
// @route   POST /api/admin/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, mobile_number, email, role, sendInviteLink } = req.body;

    const existingUser = await User.findOne({ mobile_number });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User with this mobile number already exists' });
    }

    const user = await User.create({
      name, mobile_number, email, role
    });

    // Generate Token (OTP or INVITE)
    const rawToken = sendInviteLink ? otpUtils.generateInviteToken() : otpUtils.generateOTP();
    const hashedToken = await otpUtils.hashToken(rawToken);
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (sendInviteLink ? 24 * 60 : 10)); // 24 hours or 10 mins

    await Token.create({
      user_id: user._id,
      token: hashedToken,
      type: sendInviteLink ? 'INVITE' : 'OTP',
      expires_at: expiresAt
    });

    // Mock sending OTP / Env
    console.log(`[AUTH MOCK] Generated ${sendInviteLink ? 'INVITE' : 'OTP'} for ${mobile_number}: ${rawToken}`);

    res.status(201).json({ 
      status: 'success', 
      message: 'User created successfully',
      data: { user: { id: user._id, name: user.name, role: user.role } } 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-created_at');
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    user.is_active = !user.is_active;
    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user_id: req.user._id,
      action: 'TOGGLE_USER_STATUS',
      module: 'USER',
      details: `Changed status of user ${user.name} to ${user.is_active ? 'Active' : 'Inactive'}`,
      related_id: user._id
    });

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.getUserActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ user_id: req.params.id })
      .sort('-timestamp')
      .limit(50);
    res.status(200).json({ status: 'success', data: { logs } });
  } catch (err) {
    next(err);
  }
};
