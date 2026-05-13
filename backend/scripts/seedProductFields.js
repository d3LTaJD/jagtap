const mongoose = require('mongoose');
const FieldDefinition = require('../src/models/FieldDefinition');
require('dotenv').config();

const fields = [
  // --- PRESSURE VESSEL FIELDS ---
  {
    formContext: 'Enquiry',
    fieldName: 'asmeSection',
    fieldLabel: 'ASME Section',
    fieldType: 'Dropdown (Single)',
    groupLabel: 'Pressure Vessel Specs',
    options: ['VIII Div 1', 'VIII Div 2', 'N/A'],
    displayOrder: 10
  },
  {
    formContext: 'Enquiry',
    fieldName: 'designPressure',
    fieldLabel: 'Design Pressure',
    fieldType: 'Number',
    groupLabel: 'Pressure Vessel Specs',
    validationRules: { unitLabel: 'MPa' },
    displayOrder: 11
  },
  {
    formContext: 'Enquiry',
    fieldName: 'designTemperature',
    fieldLabel: 'Design Temp',
    fieldType: 'Number',
    groupLabel: 'Pressure Vessel Specs',
    validationRules: { unitLabel: '°C' },
    displayOrder: 12
  },
  {
    formContext: 'Enquiry',
    fieldName: 'shellMaterial',
    fieldLabel: 'Shell Material',
    fieldType: 'Dropdown (Single)',
    groupLabel: 'Pressure Vessel Specs',
    options: ['SA516 Gr.70', 'SS304', 'SS316L', 'IS2062'],
    displayOrder: 13
  },
  {
    formContext: 'Enquiry',
    fieldName: 'pwhtRequired',
    fieldLabel: 'PWHT Required',
    fieldType: 'Checkbox (Boolean)',
    groupLabel: 'Pressure Vessel Specs',
    displayOrder: 14
  },
  {
    formContext: 'Enquiry',
    fieldName: 'radiographyPercent',
    fieldLabel: 'Radiography %',
    fieldType: 'Number',
    groupLabel: 'Pressure Vessel Specs',
    validationRules: { min: 0, max: 100, unitLabel: '%' },
    displayOrder: 15
  },

  // --- HEAT EXCHANGER FIELDS ---
  {
    formContext: 'Enquiry',
    fieldName: 'temaType',
    fieldLabel: 'TEMA Type',
    fieldType: 'Text (Short)',
    groupLabel: 'Heat Exchanger Specs',
    placeholder: 'e.g. BES, AEL',
    displayOrder: 20
  },
  {
    formContext: 'Enquiry',
    fieldName: 'tubeLength',
    fieldLabel: 'Tube Length',
    fieldType: 'Number',
    groupLabel: 'Heat Exchanger Specs',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 21
  },
  {
    formContext: 'Enquiry',
    fieldName: 'surfaceArea',
    fieldLabel: 'Surface Area',
    fieldType: 'Number',
    groupLabel: 'Heat Exchanger Specs',
    validationRules: { unitLabel: 'm²' },
    displayOrder: 22
  },

  // --- STORAGE TANK FIELDS ---
  {
    formContext: 'Enquiry',
    fieldName: 'tankCapacity',
    fieldLabel: 'Capacity',
    fieldType: 'Number',
    groupLabel: 'Storage Tank Specs',
    validationRules: { unitLabel: 'm³' },
    displayOrder: 30
  },
  {
    formContext: 'Enquiry',
    fieldName: 'tankType',
    fieldLabel: 'Tank Type',
    fieldType: 'Dropdown (Single)',
    groupLabel: 'Storage Tank Specs',
    options: ['Fixed Roof', 'Floating Roof', 'Cone Bottom', 'Flat Bottom'],
    displayOrder: 31
  },

  // --- QAP SPECIAL FIELDS ---
  {
    formContext: 'QAP',
    fieldName: 'inspectorSignature',
    fieldLabel: 'Inspector Signature',
    fieldType: 'Signature',
    groupLabel: 'Approvals',
    displayOrder: 100
  },
  {
    formContext: 'QAP',
    fieldName: 'inspectionLocation',
    fieldLabel: 'Inspection GPS Location',
    fieldType: 'GPS Location',
    groupLabel: 'Inspection Log',
    displayOrder: 101
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    for (const field of fields) {
      await FieldDefinition.findOneAndUpdate(
        { formContext: field.formContext, fieldName: field.fieldName },
        field,
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded/Updated: ${field.fieldLabel} (${field.formContext})`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
