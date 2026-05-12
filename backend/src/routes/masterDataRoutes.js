const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllMasterData, getMasterData, getMasterDataBySlug,
  createMasterData, updateMasterData,
  linkField, unlinkField, deleteMasterData
} = require('../controllers/masterDataController');

const router = express.Router();
router.use(protect);

// Read — any authenticated user can fetch master data for dropdowns
router.get('/', getAllMasterData);
router.get('/slug/:slug', getMasterDataBySlug);
router.get('/:id', getMasterData);

// Write — admin only
router.post('/', authorize('SUPER_ADMIN', 'DIRECTOR'), createMasterData);
router.patch('/:id', authorize('SUPER_ADMIN', 'DIRECTOR'), updateMasterData);
router.post('/:id/link-field', authorize('SUPER_ADMIN', 'DIRECTOR'), linkField);
router.delete('/:id/link-field/:fieldId', authorize('SUPER_ADMIN', 'DIRECTOR'), unlinkField);
router.delete('/:id', authorize('SUPER_ADMIN', 'DIRECTOR'), deleteMasterData);

module.exports = router;
