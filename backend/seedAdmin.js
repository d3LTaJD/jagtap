const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jagtap-workflow').then(async () => {
  try {
    let admin = await User.findOne({ email: 'admin@company.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        mobile_number: '0000000000',
        email: 'admin@company.com',
        password: 'password123',
        role: 'SUPER_ADMIN',
        is_active: true,
        is_verified: true
      });
      console.log('Admin seeded successfully!');
    } else {
      admin.password = 'password123'; // Will trigger pre-save hook to hash
      await admin.save();
      console.log('Admin already existed, reset password to password123');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
  process.exit(0);
}).catch(err => {
  console.error('DB Connection error:', err);
  process.exit(1);
});
