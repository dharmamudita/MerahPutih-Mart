const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.post('/checkout', orderController.checkout);
router.get('/history', orderController.getOrderHistory);
router.get('/:id', orderController.getOrderById);

module.exports = router;
