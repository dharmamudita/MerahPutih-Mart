const express = require('express');
const router = express.Router();
const depositController = require('../controllers/deposit.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'), depositController.getAllDeposits);
router.put('/:id/verify', verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'), depositController.verifyDeposit);

module.exports = router;
