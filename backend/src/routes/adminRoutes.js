const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/admin/analytics', adminController.getAnalytics);

module.exports = router;
