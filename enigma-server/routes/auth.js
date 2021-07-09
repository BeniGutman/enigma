const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('userName').trim().not().isEmpty(),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('userName').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 6 }),
  ],
  authController.login
);

router.post('/token', authController.refreshToken);

module.exports = router;
