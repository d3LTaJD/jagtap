const mongoose = require('mongoose');
require('dotenv').config();
const Role = require('../src/models/Role');

const rolesToSeed = [
  {
    name: 'Super Admin', code: 'SA', department: 'Admin', description: 'Full system access',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: true, assign: true },
      Quotation: { view: true, create: true, edit: true, delete: true, approve: true },
      Admin: { view: true, create: true, edit: true, delete: true },
      QAP: { view: true, create: true, edit: true, delete: true, approve: true },
      Task: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    name: 'Director', code: 'DIR', department: 'Management', description: 'Full system oversight without system configuration access',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: false, assign: true },
      Quotation: { view: true, create: true, edit: true, delete: false, approve: true },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: true },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Sales Executive', code: 'SALES', department: 'Sales', description: 'Handles leads and basic enquiries',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: false, assign: false },
      Quotation: { view: true, create: true, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Sales Manager', code: 'SM', department: 'Sales', description: 'Manages sales team and approves quotations',
    permissions: {
      Enquiry: { view: true, create: true, edit: true, delete: false, assign: true },
      Quotation: { view: true, create: true, edit: true, delete: false, approve: true },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Technical Design Specialist', code: 'TDS', department: 'Design', description: 'Handles technical specifications and designs',
    permissions: {
      Enquiry: { view: true, create: false, edit: true, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Purchase Executive', code: 'PUR', department: 'Purchase', description: 'Manages vendor relations and procurement',
    permissions: {
      Enquiry: { view: false, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: false, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Store Executive', code: 'STR', department: 'Purchase', description: 'Manages inventory and store operations',
    permissions: {
      Enquiry: { view: false, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: false, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Production Executive', code: 'PROD', department: 'Production', description: 'Manages manufacturing process',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Operations Executive', code: 'OPR', department: 'Management', description: 'Oversees daily operations',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Quality Control Engineer', code: 'QCE', department: 'QC', description: 'Performs quality checks and creates QAPs',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: false, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Quality Control Supervisor', code: 'QCS', department: 'QC', description: 'Approves QAPs and oversees QC team',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: false, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: true, edit: true, delete: false, approve: true },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Dispatch Executive', code: 'DISP', department: 'Production', description: 'Manages outbound logistics',
    permissions: {
      Enquiry: { view: false, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: false, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Accountant', code: 'ACC', department: 'Accounts', description: 'Manages billing and basic accounting',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'Accounts Manager', code: 'ACCM', department: 'Accounts', description: 'Oversees financials and approves accounting transactions',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: false, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    name: 'General Manager', code: 'MGR', department: 'Management', description: 'General operational oversight',
    permissions: {
      Enquiry: { view: true, create: false, edit: false, delete: false, assign: false },
      Quotation: { view: true, create: false, edit: false, delete: false, approve: false },
      Admin: { view: false, create: false, edit: false, delete: false },
      QAP: { view: true, create: false, edit: false, delete: false, approve: false },
      Task: { view: true, create: true, edit: true, delete: false }
    }
  }
];

async function seedRoles() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workflow_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB. Upserting roles...');

    for (const roleData of rolesToSeed) {
      await Role.findOneAndUpdate(
        { code: roleData.code },
        { $set: roleData },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded Role: ${roleData.code} - ${roleData.name}`);
    }

    console.log('Role seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
