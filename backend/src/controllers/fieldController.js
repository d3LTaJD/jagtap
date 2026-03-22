const FieldDefinition = require('../models/FieldDefinition');

// GET /api/fields?formContext=Enquiry
// Returns all active (non-deleted) fields for a form, sorted by displayOrder
exports.getFields = async (req, res, next) => {
  try {
    const { formContext } = req.query;
    const query = { isDeleted: false };
    if (formContext) query.formContext = formContext;

    const fields = await FieldDefinition.find(query).sort({ displayOrder: 1 });
    res.status(200).json({ status: 'success', data: { fields } });
  } catch (err) {
    next(err);
  }
};

// GET /api/fields/:id
exports.getField = async (req, res, next) => {
  try {
    const field = await FieldDefinition.findById(req.params.id);
    if (!field) return res.status(404).json({ status: 'error', message: 'Field not found' });
    res.status(200).json({ status: 'success', data: { field } });
  } catch (err) {
    next(err);
  }
};

// POST /api/fields  (Super Admin / Director only)
exports.createField = async (req, res, next) => {
  try {
    const {
      formContext, fieldName, fieldLabel, fieldType, placeholder,
      isRequired, options, validationRules, groupLabel,
      displayOrder, visibleToRoles, editableByRoles, conditionalLogic, productCategory
    } = req.body;

    // Auto-generate fieldName from label if not provided
    const resolvedFieldName = fieldName || fieldLabel.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, c => c.toLowerCase());

    const field = await FieldDefinition.create({
      formContext, productCategory,
      fieldName: resolvedFieldName, fieldLabel, fieldType, placeholder,
      isRequired: isRequired || false,
      options: options || [],
      validationRules: validationRules || {},
      groupLabel,
      displayOrder: displayOrder !== undefined ? displayOrder : 9999,
      visibleToRoles: visibleToRoles || [],
      editableByRoles: editableByRoles || [],
      conditionalLogic: conditionalLogic || {}
    });

    res.status(201).json({ status: 'success', data: { field } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: 'error', message: `A field named "${req.body.fieldName || req.body.fieldLabel}" already exists for this form.` });
    }
    next(err);
  }
};

// PATCH /api/fields/:id  — update any field properties
exports.updateField = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'fieldLabel', 'fieldType', 'placeholder', 'isRequired', 'options',
      'validationRules', 'groupLabel', 'displayOrder', 'visibleToRoles',
      'editableByRoles', 'conditionalLogic', 'isActive', 'productCategory'
    ];
    const updates = {};
    allowedUpdates.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const field = await FieldDefinition.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!field) return res.status(404).json({ status: 'error', message: 'Field not found' });

    res.status(200).json({ status: 'success', data: { field } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/fields/reorder  — body: [{ id, displayOrder }, ...]
exports.reorderFields = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // [{ id: '...', displayOrder: 0 }, ...]
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ status: 'error', message: 'orderedIds must be an array' });
    }

    const ops = orderedIds.map(({ id, displayOrder }) =>
      FieldDefinition.findByIdAndUpdate(id, { displayOrder })
    );
    await Promise.all(ops);

    res.status(200).json({ status: 'success', message: 'Fields reordered successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/fields/:id  — SOFT DELETE only (preserves historical records)
exports.deleteField = async (req, res, next) => {
  try {
    const field = await FieldDefinition.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!field) return res.status(404).json({ status: 'error', message: 'Field not found' });

    res.status(200).json({ status: 'success', message: 'Field removed from forms. Historical data preserved.' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/fields/:id/restore  — undo soft-delete
exports.restoreField = async (req, res, next) => {
  try {
    const field = await FieldDefinition.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, isActive: true },
      { new: true }
    );
    if (!field) return res.status(404).json({ status: 'error', message: 'Field not found' });

    res.status(200).json({ status: 'success', data: { field } });
  } catch (err) {
    next(err);
  }
};
