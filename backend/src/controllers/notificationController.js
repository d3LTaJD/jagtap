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
