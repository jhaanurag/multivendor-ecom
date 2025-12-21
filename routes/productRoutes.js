const express = require('express');
const router = express.Router();
const {
    getProducts,
    getVendorProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/vendor', protect, authorize('vendor', 'admin'), getVendorProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize('vendor', 'admin'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

router.post('/:id/review', protect, createProductReview);

module.exports = router;
