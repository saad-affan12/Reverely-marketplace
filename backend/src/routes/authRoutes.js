const express = require('express');
const router = express.Router();
const { register, login, getMe, demoLogin } = require('../controllers/authController');
const { authenticate } = require('../middleware/authenticate');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', authenticate, getMe);

module.exports = router;
