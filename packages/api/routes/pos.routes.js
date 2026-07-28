const express = require('express');
const router = express.Router();
const posController = require('../controllers/pos.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Semua rute POS membutuhkan role Admin Kopdes
router.use(verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'));

router.post('/checkout', posController.checkoutPOS);

module.exports = router;
