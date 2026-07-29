const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'));

router.get('/dashboard', reportController.getDashboardStats);

module.exports = router;
