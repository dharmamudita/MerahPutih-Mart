const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/profile', memberController.getMemberProfile);

module.exports = router;
