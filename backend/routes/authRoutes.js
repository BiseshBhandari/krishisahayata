const express = require('express');
const authControllers = require('../controller/authController');

const router = express.Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/forgot_password', authControllers.forgotPassword);

module.exports = router;