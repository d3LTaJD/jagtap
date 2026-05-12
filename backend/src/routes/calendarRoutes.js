const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/events', calendarController.getCalendarEvents);

module.exports = router;
