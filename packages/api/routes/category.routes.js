const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route (bisa diakses customer)
router.get('/', categoryController.getAllCategories);

// Protected routes
router.post('/', 
  verifyToken, 
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'), 
  upload.single('icon'), 
  categoryController.createCategory
);

router.put('/:id',
  verifyToken,
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'),
  categoryController.updateCategory
);

router.delete('/:id',
  verifyToken,
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'),
  categoryController.deleteCategory
);

module.exports = router;
