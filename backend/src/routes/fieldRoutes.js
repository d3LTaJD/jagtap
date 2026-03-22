const express = require('express');
const {
  getFields, getField, createField, updateField,
  reorderFields, deleteField, restoreField
} = require('../controllers/fieldController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Read — any authenticated user can fetch field definitions to render forms
router.get('/', getFields);
router.get('/:id', getField);

// Write — only Super Admin and Director can create/modify/delete fields
router.post('/', authorize('SUPER_ADMIN', 'DIRECTOR'), createField);
router.patch('/reorder', authorize('SUPER_ADMIN', 'DIRECTOR'), reorderFields);
router.patch('/:id', authorize('SUPER_ADMIN', 'DIRECTOR'), updateField);
router.patch('/:id/restore', authorize('SUPER_ADMIN', 'DIRECTOR'), restoreField);
router.delete('/:id', authorize('SUPER_ADMIN', 'DIRECTOR'), deleteField);

module.exports = router;
