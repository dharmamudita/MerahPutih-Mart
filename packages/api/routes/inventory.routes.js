const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.get('/', inventoryController.getInventory);
router.post('/mutate', inventoryController.mutateStock);

module.exports = router;
