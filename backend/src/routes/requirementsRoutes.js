const express = require('express');
const router = express.Router();
const {
  getRequirements,
  getRequirementById,
  createRequirement,
  updateRequirementStatus,
  deleteRequirement,
} = require('../controllers/requirementsController');
const {
  getOffersByRequirementId,
  submitOffer,
} = require('../controllers/offersController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

// Requirements CRUD
router.get('/', getRequirements);
router.get('/:id', getRequirementById);
router.post('/', authenticate, authorize('customer', 'admin'), createRequirement);
router.patch('/:id/status', authenticate, updateRequirementStatus);
router.delete('/:id', authenticate, deleteRequirement);

// Nested Offers on Requirement
router.get('/:id/offers', getOffersByRequirementId);
router.post('/:id/offers', authenticate, authorize('vendor', 'admin'), submitOffer);

module.exports = router;
