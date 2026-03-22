/**
 * Seed Script — Product Category Dynamic Fields
 * -----------------------------------------------
 * Pre-configures all category-specific fields as described in section 2.3
 * of the project specification document.
 *
 * Run with: node src/scripts/seedProductFields.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const FieldDefinition = require('../models/FieldDefinition');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

// Helper to make a clean fieldName from label
const toFieldName = (label) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

// ─────────────────────────────────────────────────────────────────
// FIELD DEFINITIONS — grouped by Product Category
// Each field has:
//   conditionalLogic: { dependsOnField: 'productCategory', requiredValue: '<Category>' }
// ─────────────────────────────────────────────────────────────────

const makeField = (label, fieldType, extras = {}) => ({
  formContext: 'Enquiry',
  fieldLabel: label,
  fieldName: extras.fieldName || toFieldName(label),
  fieldType,
  isActive: true,
  isDeleted: false,
  visibleToRoles: [],
  editableByRoles: [],
  ...extras,
});

const makeCategoryField = (category, label, fieldType, extras = {}) =>
  makeField(label, fieldType, {
    conditionalLogic: {
      dependsOnField: 'productCategory',
      requiredValue: category,
    },
    groupLabel: category,
    ...extras,
  });

// ─────────────────────────────────────────────────────────────────
// 1. PRESSURE VESSEL
// ─────────────────────────────────────────────────────────────────
const pressureVesselFields = [
  makeCategoryField('Pressure Vessel', 'ASME Section', 'Dropdown (Single)', {
    fieldName: 'pv_asmeSection',
    options: ['VIII Div 1', 'VIII Div 2'],
    displayOrder: 10,
  }),
  makeCategoryField('Pressure Vessel', 'Design Pressure', 'Number', {
    fieldName: 'pv_designPressure',
    placeholder: 'e.g. 10.5',
    validationRules: { unitLabel: 'MPa' },
    displayOrder: 11,
  }),
  makeCategoryField('Pressure Vessel', 'Design Temperature', 'Number', {
    fieldName: 'pv_designTemperature',
    placeholder: 'e.g. 250',
    validationRules: { unitLabel: '°C' },
    displayOrder: 12,
  }),
  makeCategoryField('Pressure Vessel', 'Shell Material', 'Text (Short)', {
    fieldName: 'pv_shellMaterial',
    placeholder: 'e.g. SA516 Gr.70',
    displayOrder: 13,
  }),
  makeCategoryField('Pressure Vessel', 'Head Type', 'Dropdown (Single)', {
    fieldName: 'pv_headType',
    options: ['Ellipsoidal', 'Hemispherical', 'Flat', 'Torispherical'],
    displayOrder: 14,
  }),
  makeCategoryField('Pressure Vessel', 'Nozzle Count', 'Number', {
    fieldName: 'pv_nozzleCount',
    placeholder: 'e.g. 6',
    displayOrder: 15,
  }),
  makeCategoryField('Pressure Vessel', 'Flange Rating', 'Text (Short)', {
    fieldName: 'pv_flangeRating',
    placeholder: 'e.g. 150#, 300#',
    displayOrder: 16,
  }),
  makeCategoryField('Pressure Vessel', 'Third-party Inspection Required', 'Checkbox (Boolean)', {
    fieldName: 'pv_thirdPartyInspection',
    displayOrder: 17,
  }),
  makeCategoryField('Pressure Vessel', 'IBR Applicable', 'Checkbox (Boolean)', {
    fieldName: 'pv_ibrApplicable',
    displayOrder: 18,
  }),
  makeCategoryField('Pressure Vessel', 'Radiography % (RT)', 'Number', {
    fieldName: 'pv_radiographyPct',
    placeholder: 'e.g. 100',
    validationRules: { min: 0, max: 100, unitLabel: '%' },
    displayOrder: 19,
  }),
  makeCategoryField('Pressure Vessel', 'PWHT Required', 'Checkbox (Boolean)', {
    fieldName: 'pv_pwhtRequired',
    displayOrder: 20,
  }),
  makeCategoryField('Pressure Vessel', 'Hydro Test Pressure', 'Number', {
    fieldName: 'pv_hydroTestPressure',
    placeholder: 'e.g. 15',
    validationRules: { unitLabel: 'MPa' },
    displayOrder: 21,
  }),
  makeCategoryField('Pressure Vessel', 'MOC (Material of Construction)', 'Text (Short)', {
    fieldName: 'pv_moc',
    placeholder: 'e.g. CS, SS304, SS316',
    displayOrder: 22,
  }),
  makeCategoryField('Pressure Vessel', 'Shell Thickness', 'Number', {
    fieldName: 'pv_shellThickness',
    placeholder: 'e.g. 12',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 23,
  }),
  makeCategoryField('Pressure Vessel', 'Shell Diameter (ID/OD)', 'Text (Short)', {
    fieldName: 'pv_shellDiameter',
    placeholder: 'e.g. ID 1200mm',
    displayOrder: 24,
  }),
  makeCategoryField('Pressure Vessel', 'Seamless / Welded', 'Dropdown (Single)', {
    fieldName: 'pv_seamlessWelded',
    options: ['Seamless', 'Welded'],
    displayOrder: 25,
  }),
];

// ─────────────────────────────────────────────────────────────────
// 2. HEAT EXCHANGER
// ─────────────────────────────────────────────────────────────────
const heatExchangerFields = [
  makeCategoryField('Heat Exchanger', 'TEMA Type', 'Dropdown (Single)', {
    fieldName: 'he_temaType',
    options: ['E', 'F', 'G', 'H', 'J', 'K', 'X'],
    displayOrder: 30,
  }),
  makeCategoryField('Heat Exchanger', 'Shell OD', 'Number', {
    fieldName: 'he_shellOD',
    placeholder: 'e.g. 600',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 31,
  }),
  makeCategoryField('Heat Exchanger', 'Tube OD', 'Number', {
    fieldName: 'he_tubeOD',
    placeholder: 'e.g. 25',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 32,
  }),
  makeCategoryField('Heat Exchanger', 'Tube Length', 'Number', {
    fieldName: 'he_tubeLength',
    placeholder: 'e.g. 4800',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 33,
  }),
  makeCategoryField('Heat Exchanger', 'Number of Tubes', 'Number', {
    fieldName: 'he_numberOfTubes',
    placeholder: 'e.g. 150',
    displayOrder: 34,
  }),
  makeCategoryField('Heat Exchanger', 'Tube Pitch', 'Number', {
    fieldName: 'he_tubePitch',
    placeholder: 'e.g. 32',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 35,
  }),
  makeCategoryField('Heat Exchanger', 'Number of Passes', 'Number', {
    fieldName: 'he_numberOfPasses',
    placeholder: 'e.g. 2',
    displayOrder: 36,
  }),
  makeCategoryField('Heat Exchanger', 'Baffle Type', 'Text (Short)', {
    fieldName: 'he_baffleType',
    placeholder: 'e.g. Single Segmental, 25%',
    displayOrder: 37,
  }),
  makeCategoryField('Heat Exchanger', 'Design Pressure (Shell / Tube side)', 'Text (Short)', {
    fieldName: 'he_designPressureShellTube',
    placeholder: 'e.g. Shell: 10 MPa / Tube: 15 MPa',
    displayOrder: 38,
  }),
  makeCategoryField('Heat Exchanger', 'Design Temperature (Shell / Tube)', 'Text (Short)', {
    fieldName: 'he_designTempShellTube',
    placeholder: 'e.g. Shell: 200°C / Tube: 250°C',
    displayOrder: 39,
  }),
  makeCategoryField('Heat Exchanger', 'Shell MOC', 'Text (Short)', {
    fieldName: 'he_shellMOC',
    placeholder: 'e.g. SA516 Gr.70',
    displayOrder: 40,
  }),
  makeCategoryField('Heat Exchanger', 'Tube MOC', 'Text (Short)', {
    fieldName: 'he_tubeMOC',
    placeholder: 'e.g. SA179, SS304',
    displayOrder: 41,
  }),
  makeCategoryField('Heat Exchanger', 'Surface Area', 'Number', {
    fieldName: 'he_surfaceArea',
    placeholder: 'e.g. 120',
    validationRules: { unitLabel: 'm²' },
    displayOrder: 42,
  }),
  makeCategoryField('Heat Exchanger', 'Fouling Factor', 'Number', {
    fieldName: 'he_foulingFactor',
    placeholder: 'e.g. 0.0002',
    displayOrder: 43,
  }),
];

// ─────────────────────────────────────────────────────────────────
// 3. STORAGE TANK
// ─────────────────────────────────────────────────────────────────
const storageTankFields = [
  makeCategoryField('Storage Tank', 'Tank Type', 'Dropdown (Single)', {
    fieldName: 'st_tankType',
    options: ['Fixed Roof', 'Floating Roof', 'Cone Bottom', 'Flat Bottom'],
    displayOrder: 50,
  }),
  makeCategoryField('Storage Tank', 'Capacity', 'Number', {
    fieldName: 'st_capacity',
    placeholder: 'e.g. 50000',
    validationRules: { unitLabel: 'litres' },
    displayOrder: 51,
  }),
  makeCategoryField('Storage Tank', 'Diameter', 'Number', {
    fieldName: 'st_diameter',
    placeholder: 'e.g. 3000',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 52,
  }),
  makeCategoryField('Storage Tank', 'Height / Length', 'Number', {
    fieldName: 'st_heightLength',
    placeholder: 'e.g. 5000',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 53,
  }),
  makeCategoryField('Storage Tank', 'Operating Pressure', 'Number', {
    fieldName: 'st_operatingPressure',
    placeholder: 'e.g. 0.5',
    validationRules: { unitLabel: 'MPa' },
    displayOrder: 54,
  }),
  makeCategoryField('Storage Tank', 'Material Grade', 'Text (Short)', {
    fieldName: 'st_materialGrade',
    placeholder: 'e.g. IS2062 E250',
    displayOrder: 55,
  }),
  makeCategoryField('Storage Tank', 'Insulation Required', 'Checkbox (Boolean)', {
    fieldName: 'st_insulationRequired',
    displayOrder: 56,
  }),
  makeCategoryField('Storage Tank', 'Lining Required', 'Checkbox (Boolean)', {
    fieldName: 'st_liningRequired',
    displayOrder: 57,
  }),
  makeCategoryField('Storage Tank', 'Level Gauge Type', 'Text (Short)', {
    fieldName: 'st_levelGaugeType',
    placeholder: 'e.g. Magnetic, Glass',
    displayOrder: 58,
  }),
  makeCategoryField('Storage Tank', 'Vent Type', 'Text (Short)', {
    fieldName: 'st_ventType',
    placeholder: 'e.g. Pressure Vacuum Vent',
    displayOrder: 59,
  }),
];

// ─────────────────────────────────────────────────────────────────
// 4. PIPING / PIPE FABRICATION
// ─────────────────────────────────────────────────────────────────
const pipingFields = [
  makeCategoryField('Piping / Pipe Fabrication', 'Pipe Grade', 'Text (Short)', {
    fieldName: 'pp_pipeGrade',
    placeholder: 'e.g. SA106 Gr.B, IS3589',
    displayOrder: 60,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Size (NB)', 'Text (Short)', {
    fieldName: 'pp_sizeNB',
    placeholder: 'e.g. 100NB, 150NB',
    displayOrder: 61,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Schedule', 'Text (Short)', {
    fieldName: 'pp_schedule',
    placeholder: 'e.g. SCH 40, SCH 80, XH',
    displayOrder: 62,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'End Connection', 'Dropdown (Single)', {
    fieldName: 'pp_endConnection',
    options: ['BW (Butt Weld)', 'SW (Socket Weld)', 'Flanged', 'Threaded'],
    displayOrder: 63,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Pipe Length', 'Number', {
    fieldName: 'pp_pipeLength',
    placeholder: 'e.g. 6000',
    validationRules: { unitLabel: 'mm' },
    displayOrder: 64,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Fitting Types Required', 'Text (Short)', {
    fieldName: 'pp_fittingTypes',
    placeholder: 'e.g. Elbows, Tees, Reducers',
    displayOrder: 65,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Hydro Test Required', 'Checkbox (Boolean)', {
    fieldName: 'pp_hydroTestRequired',
    displayOrder: 66,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'PWHT Required', 'Checkbox (Boolean)', {
    fieldName: 'pp_pwhtRequired',
    displayOrder: 67,
  }),
  makeCategoryField('Piping / Pipe Fabrication', 'Radiography %', 'Number', {
    fieldName: 'pp_radiographyPct',
    placeholder: 'e.g. 100',
    validationRules: { min: 0, max: 100, unitLabel: '%' },
    displayOrder: 68,
  }),
];

// ─────────────────────────────────────────────────────────────────
// 5. STRUCTURAL FABRICATION
// ─────────────────────────────────────────────────────────────────
const structuralFields = [
  makeCategoryField('Structural Fabrication', 'Structural Section', 'Dropdown (Single)', {
    fieldName: 'sf_structuralSection',
    options: ['I-Beam', 'Channel', 'Angle', 'Hollow Section (SHS/RHS/CHS)', 'Plate'],
    displayOrder: 70,
  }),
  makeCategoryField('Structural Fabrication', 'Material Grade', 'Text (Short)', {
    fieldName: 'sf_materialGrade',
    placeholder: 'e.g. IS2062 E250, IS2062 E350',
    displayOrder: 71,
  }),
  makeCategoryField('Structural Fabrication', 'Design Load', 'Text (Short)', {
    fieldName: 'sf_designLoad',
    placeholder: 'e.g. 5 MT point load',
    displayOrder: 72,
  }),
  makeCategoryField('Structural Fabrication', 'Connection Type', 'Dropdown (Single)', {
    fieldName: 'sf_connectionType',
    options: ['Bolted', 'Welded', 'Bolted + Welded'],
    displayOrder: 73,
  }),
  makeCategoryField('Structural Fabrication', 'Surface Treatment', 'Dropdown (Single)', {
    fieldName: 'sf_surfaceTreatment',
    options: ['Paint', 'Galvanised', 'Epoxy Coated', 'Hot Dip Galvanised', 'None'],
    displayOrder: 74,
  }),
  makeCategoryField('Structural Fabrication', 'Weight (estimated)', 'Number', {
    fieldName: 'sf_weightEstimated',
    placeholder: 'e.g. 2.5',
    validationRules: { unitLabel: 'MT' },
    displayOrder: 75,
  }),
];

// ─────────────────────────────────────────────────────────────────
// 6. CUSTOM / JOB WORK
// ─────────────────────────────────────────────────────────────────
const customJobWorkFields = [
  makeCategoryField('Custom Fabrication', 'Description', 'Text (Long)', {
    fieldName: 'cj_description',
    placeholder: 'Describe the custom job in detail...',
    displayOrder: 80,
  }),
  makeCategoryField('Custom Fabrication', 'Reference Drawing No.', 'Text (Short)', {
    fieldName: 'cj_referenceDrawingNo',
    placeholder: 'e.g. DRG-2024-001-A',
    displayOrder: 81,
  }),
  makeCategoryField('Custom Fabrication', 'Customer-supplied Drawing', 'File Upload', {
    fieldName: 'cj_customerDrawing',
    displayOrder: 82,
  }),
  makeCategoryField('Custom Fabrication', 'Special Process Requirements', 'Text (Long)', {
    fieldName: 'cj_specialProcessReq',
    placeholder: 'e.g. Cryogenic service, post-weld treatment required...',
    displayOrder: 83,
  }),
  makeCategoryField('Custom Fabrication', 'Applicable Standard', 'Text (Short)', {
    fieldName: 'cj_applicableStandard',
    placeholder: 'e.g. ASME, IS 2825, EN 13445',
    displayOrder: 84,
  }),
  makeCategoryField('Custom Fabrication', 'Inspection Scope', 'Text (Long)', {
    fieldName: 'cj_inspectionScope',
    placeholder: 'e.g. Radiography, UT, DPT, Hydro test...',
    displayOrder: 85,
  }),
];

// ─────────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────────
const allFields = [
  ...pressureVesselFields,
  ...heatExchangerFields,
  ...storageTankFields,
  ...pipingFields,
  ...structuralFields,
  ...customJobWorkFields,
];

const seed = async () => {
  await connectDB();

  console.log(`\n📦 Seeding ${allFields.length} product category fields...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const field of allFields) {
    try {
      // upsert — update if exists, create if new
      await FieldDefinition.findOneAndUpdate(
        { formContext: field.formContext, fieldName: field.fieldName },
        { $set: field },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✅ [${field.groupLabel}] ${field.fieldLabel}`);
      created++;
    } catch (err) {
      console.error(`  ❌ [${field.groupLabel}] ${field.fieldLabel} — ${err.message}`);
      errors++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Done! Created/Updated: ${created}, Errors: ${errors}`);
  console.log(`─────────────────────────────────────────\n`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
