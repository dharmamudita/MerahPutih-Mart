const express = require('express');
const router = express.Router();
const posController = require('../controllers/pos.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Semua rute POS membutuhkan role Admin Kopdes
router.use(verifyToken, isAdmin);

router.post('/checkout', posController.checkoutPOS);

module.exports = router;
