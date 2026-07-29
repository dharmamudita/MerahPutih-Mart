const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (bisa diakses customer)
router.get('/', productController.getAllProducts);
router.get('/:identifier', productController.getProductByIdOrSlug);

// Protected routes (Admin KopDes & Super Admin)
router.post('/', 
  verifyToken, 
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'), 
  upload.array('images', 5), // Maksimal 5 gambar sekaligus
  productController.createProduct
);

router.put('/:id', 
  verifyToken, 
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'), 
  upload.array('images', 5), 
  productController.updateProduct
);

router.delete('/:id',
  verifyToken,
  authorize('SUPER_ADMIN', 'ADMIN_KOPDES'),
  productController.deleteProduct
);

module.exports = router;
