const express = require('express');
const router = express.Router();
const { getVendorReviews, createOrderReview } = require('../controllers/reviewsController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

router.get('/vendor/:id', getVendorReviews);
router.post('/order/:id', authenticate, authorize('customer', 'admin'), createOrderReview);

module.exports = router;
