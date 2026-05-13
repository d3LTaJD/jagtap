const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id })
      .sort('-created_at')
      .limit(50);
    res.status(200).json({ status: 'success', data: { notifications } });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.status(200).json({ status: 'success' });
  } catch(err) { next(err); }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, is_read: false }, { is_read: true });
    res.status(200).json({ status: 'success' });
  } catch(err) { next(err); }
};

// @desc    Send a test notification to the current user (for debugging)
// @route   POST /api/notifications/test
exports.sendTestNotification = async (req, res, next) => {
  try {
    const notif = await Notification.create({
      user_id: req.user._id,
      type: 'INFO',
      title: '🔔 Notification System Active',
      message: `This is a test notification sent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}. Your notifications are working correctly!`
    });
    console.log(`[Notification] Test notification created for user ${req.user._id}`);
    res.status(201).json({ status: 'success', data: { notification: notif } });
  } catch(err) { next(err); }
};
