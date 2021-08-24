const express = require('express');
const { body } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');
const { validateRequest } = require('../util/requests-validator');

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('userName').trim().not().isEmpty(),
  ],
  asyncHandler(validateRequest(authController.register))
);

// POST /auth/login
router.post(
  '/login',
  [
    body('userName').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 6 }),
  ],
  asyncHandler(validateRequest(authController.login))
);

// POST /auth/token
router.post(
  '/token',
  body('token').not().isEmpty(),
  validateRequest(authController.refreshToken)
);

module.exports = router;
