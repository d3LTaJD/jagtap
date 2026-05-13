const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('../src/models/Role');

const rolesToSeed = [
  {
    name: 'Super Admin', code: 'SA', department: 'Admin', description: 'IT Admin / Intan Networks - Full system access',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: true, assign: true },
      Quotation: { view: true, create: true, edit: true, delete: true, approve: true },
      Admin: { view: true, create: true, edit: true, delete: true },
      QAP: { view: true, create: true, edit: true, delete: true, approve: true },
      Task: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    name: 'Director / Owner', code: 'DIR', department: 'Management', description: 'Owner / MD - Full view and final approvals',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: false, assign: true },
      Quotation: { view: true, create: true, edit: true, delete: false, approve: true },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: true },
      Task: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    name: 'Technical Authority', code: 'TA', department: 'Design', description: 'Yogesh Sir - Technical specifications and field config',
    permissions: {
      Enquiry: { view: true, create: false, edit: true, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: true, delete: false, approve: true },
      Admin: { view: true, create: false, edit: true, delete: false }, // Can manage field builder
      QAP: { view: true, create: false, edit: true, delete: false, approve: true },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Sales Executive', code: 'SALES', department: 'Sales', description: 'Sales team - Enquiries and drafts',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: false, assign: false },
      Quotation: { view: true, create: true, edit: true, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Design Engineer', code: 'DE', department: 'Design', description: 'Design team - Drawings and technical notes',
    permissions: {
      Enquiry: { view: true, create: false, edit: true, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: true, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'QC Engineer', code: 'QCE', department: 'QC', description: 'QC team - Create and edit QAP',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'QC Supervisor', code: 'QCS', department: 'QC', description: 'QC Supervisor - Approve QAP and assign jobs',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: true },
      Task: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    name: 'Accounts', code: 'ACC', department: 'Accounts', description: 'Accounts team - Commercial and payment terms',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: true, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Management Viewer', code: 'MGR', department: 'Management', description: 'Management read-only dashboards',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: false, edit: false, delete: false }
    }
  }
];

async function seedRoles() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log('Connected. Cleaning up old roles and upserting official SOW roles...');

    // Clear roles not in our official list (optional but keeps it clean)
    const officialCodes = rolesToSeed.map(r => r.code);
    await Role.deleteMany({ code: { $nin: officialCodes } });

    for (const roleData of rolesToSeed) {
      await Role.findOneAndUpdate(
        { code: roleData.code },
        { $set: roleData },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded Role: ${roleData.code} - ${roleData.name}`);
    }

    console.log('Official Role seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
