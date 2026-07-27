const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Semua rute pesanan membutuhkan token login pelanggan
router.use(verifyToken);

router.post('/checkout', orderController.checkout);
router.post('/:orderId/payment-proof', upload.single('proof'), orderController.uploadPaymentProof);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;
