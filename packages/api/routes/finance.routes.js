const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'));

router.get('/cashflow', financeController.getCashFlows);
router.post('/cashflow', financeController.addCashFlow);
router.get('/summary', financeController.getFinanceSummary);

module.exports = router;
