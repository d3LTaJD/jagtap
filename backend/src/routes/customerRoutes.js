const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', c.getCustomers);
router.get('/:id', c.getCustomer);
router.post('/', c.createCustomer);
router.patch('/:id', c.updateCustomer);
router.delete('/:id', c.deleteCustomer);

module.exports = router;
