const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: { user: process.env.EMAIL_USER || 'dummy@gmail.com', pass: process.env.EMAIL_PASS || 'dummy' }
});

exports.createNotification = async ({ user_id, type, title, message, related_id }) => {
  try {
    if (!user_id) return;
    await Notification.create({ user_id, type, title, message, related_id });
  } catch(err) { console.error('Error creating notification', err); }
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
  } catch(err) { console.error('Error sending email', err); }
};

exports.notifyRoles = async ({ roles, type, title, message, related_id }) => {
  try {
    const users = await User.find();
    for(const u of users) {
      if (roles.includes(u.role)) {
        await exports.createNotification({ user_id: u._id, type, title, message, related_id });
      }
    }
  } catch(err) { console.error(err); }
};
