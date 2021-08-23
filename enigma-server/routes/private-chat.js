const express = require('express');
const { body } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const privateChatController = require('../controllers/private-chat');

const router = express.Router();

// GET /chats/privateChats
router.get('/', asyncHandler(privateChatController.getPrivateChatsMetadata));

// POST /chats/privateChats
router.post(
  '/',
  body('otherUserName').trim().not().isEmpty(),
  asyncHandler(privateChatController.openPrivateChat)
);

module.exports = router;
