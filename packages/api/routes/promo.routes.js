const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promo.controller');

router.get('/', promoController.getNationalPromos);
router.post('/', promoController.createNationalPromo);

module.exports = router;
