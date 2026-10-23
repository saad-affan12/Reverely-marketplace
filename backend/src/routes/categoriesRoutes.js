const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoriesController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');

router.get('/', getCategories);
router.post('/', authenticate, authorize('admin'), createCategory);

module.exports = router;
