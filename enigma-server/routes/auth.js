const express = require('express');
const { body } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('userName').trim().not().isEmpty(),
  ],
  asyncHandler(authController.register)
);

router.post(
  '/login',
  [
    body('userName').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 6 }),
  ],
  asyncHandler(authController.login)
);

router.post(
  '/token',
  body('token').not().isEmpty(),
  authController.refreshToken
);

module.exports = router;
