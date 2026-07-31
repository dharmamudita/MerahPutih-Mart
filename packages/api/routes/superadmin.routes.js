const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superadmin.controller');
const kopdesController = require('../controllers/kopdes.controller');
const usersController = require('../controllers/users.controller');
const monitoringController = require('../controllers/monitoring.controller');
const masterController = require('../controllers/master.controller');
const depositController = require('../controllers/deposit.controller');
const promoController = require('../controllers/promo.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Hanya bisa diakses oleh Super Admin (Pusat)
// router.use(verifyToken, authorize('SUPER_ADMIN')); // Kita matikan dulu authorize-nya jika mau tes tanpa token strict

router.get('/dashboard', superAdminController.getNationalDashboard);

// Manajemen Kopdes
router.get('/kopdes', kopdesController.getAllKopdes);
router.post('/kopdes', kopdesController.createKopdes);
router.put('/kopdes/:id', kopdesController.updateKopdes);
router.put('/kopdes/:id/status', kopdesController.changeKopdesStatus);

// Manajemen Pengguna (Admin)
router.get('/users', usersController.getAllAdminUsers);
router.post('/users', usersController.createAdminUser);
router.put('/users/:id/status', usersController.changeUserStatus);

// Monitoring Operasional
router.get('/monitoring/transactions', monitoringController.getNationalTransactions);
router.get('/monitoring/stock', monitoringController.getNationalCriticalStock);

// Master Data (Kategori Global)
router.get('/categories', masterController.getGlobalCategories);
router.post('/categories', masterController.createGlobalCategory);
router.delete('/categories/:id', masterController.deleteGlobalCategory);

// Setoran Harian (Pusat Keuangan)
router.get('/deposits', depositController.getAllDeposits);
router.put('/deposits/:id/verify', depositController.verifyDeposit);

// Manajemen Promo Nasional
router.get('/promos', promoController.getNationalPromos);
router.post('/promos', promoController.createNationalPromo);

module.exports = router;
