const express = require('express');
const { body, param } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');
const groupRoutes = require('./group');
const privateChatRoutes = require('./private-chat');

const router = express.Router();

router.use(authController.verifyToken);
router.use('groups', groupRoutes);
router.use('privateChats', privateChatRoutes);

// GET /chats/:chatId/messages
router.get(
  '/:chatId/messages',
  param('chatId').isInt(),
  asyncHandler(chatController.getChatMessages)
);

// POST /chats/:chatId/messages
router.post(
  '/:chatId/messages',
  param('chatId').isInt(),
  body('message').trim().not().isEmpty(),
  asyncHandler(chatController.sendMessage)
);

module.exports = router;
