const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth');

// Public route to get reviews
router.get('/:productId', reviewController.getProductReviews);

// Protected routes to post reviews
router.use(verifyToken);
router.get('/check/:productId', reviewController.checkCanReview);
router.post('/', reviewController.addReview);

module.exports = router;
