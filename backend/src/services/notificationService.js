const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Role = require('../models/Role');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: { user: process.env.EMAIL_USER || 'dummy@gmail.com', pass: process.env.EMAIL_PASS || 'dummy' },
  connectionTimeout: 10000, // 10 seconds to fail fast if connection hangs
  greetingTimeout: 10000,
  socketTimeout: 15000
});

exports.createNotification = async ({ user_id, type, title, message, related_id }) => {
  try {
    if (!user_id) return;
    const notif = await Notification.create({ user_id, type, title, message, related_id });
    console.log(`[Notification] Created: "${title}" for user ${user_id}`);
    return notif;
  } catch(err) { console.error('[Notification] Error creating notification:', err.message); }
};

exports.sendEmail = async ({ userId, subject, text }) => {
  try {
    const u = await User.findById(userId);
    if (!u || !u.email) return;
    if (!process.env.EMAIL_USER) {
      console.log(`\n========== [Email Mock] ==========`);
      console.log(`To: ${u.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: \n${text}`);
      console.log(`==================================\n`);
      return; 
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: u.email, subject, text });
  } catch(err) { console.error('[Email] Error sending email:', err.message); }
};

/**
 * Notify all users that have a matching role code.
 * Handles both:
 *   - Direct string match (e.g. user.role === 'SUPER_ADMIN')
 *   - Role code lookup (e.g. user.role stores a Role name/code like 'SA', 'DIR')
 */
exports.notifyRoles = async ({ roles, type, title, message, related_id }) => {
  try {
    // Normalize roles to uppercase for comparison
    const normalizedRoles = roles.map(r => r.toUpperCase());

    // Strategy 1: Direct match on user.role field
    const users = await User.find({ is_active: true });
    
    // Strategy 2: Also look up Role documents to find matching codes
    const matchingRoles = await Role.find({
      $or: [
        { code: { $in: normalizedRoles } },
        { name: { $regex: new RegExp(normalizedRoles.join('|'), 'i') } }
      ]
    });
    const matchingRoleCodes = matchingRoles.map(r => r.code);
    const matchingRoleNames = matchingRoles.map(r => r.name);

    let notifiedCount = 0;
    for (const u of users) {
      const userRole = (u.role || '').toUpperCase();
      const shouldNotify = normalizedRoles.includes(userRole) ||
                           matchingRoleCodes.includes(u.role) ||
                           matchingRoleNames.includes(u.role);
      
      if (shouldNotify) {
        await exports.createNotification({ user_id: u._id, type, title, message, related_id });
        notifiedCount++;
      }
    }

    if (notifiedCount > 0) {
      console.log(`[Notification] notifyRoles: Notified ${notifiedCount} user(s) for roles [${roles.join(', ')}]`);
    }
  } catch(err) { console.error('[Notification] notifyRoles error:', err.message); }
};
