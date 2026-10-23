const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  toggleUserVerification,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

router.use(authenticate, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/verify', toggleUserVerification);

module.exports = router;
