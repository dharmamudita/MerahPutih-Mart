const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'));

router.get('/', inventoryController.getInventory);
router.get('/movements', inventoryController.getMovements);
router.post('/mutate', inventoryController.mutateStock);

module.exports = router;
