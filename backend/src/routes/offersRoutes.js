const express = require('express');
const router = express.Router();
const {
  getOffersByRequirementId,
  getOffers,
  getOfferById,
  submitOffer,
  acceptOffer,
} = require('../controllers/offersController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Top-level offers endpoints
router.get('/', authenticate, getOffers);
router.get('/:id', getOfferById);
router.post('/:id/accept', authenticate, authorize('customer', 'admin'), acceptOffer);

module.exports = router;
