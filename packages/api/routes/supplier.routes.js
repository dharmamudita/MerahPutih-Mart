const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('ADMIN_KOPDES', 'SUPER_ADMIN'));

router.get('/', supplierController.getSuppliers);
router.post('/', supplierController.createSupplier);

module.exports = router;
