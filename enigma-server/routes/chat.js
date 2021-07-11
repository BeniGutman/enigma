const express = require('express');
const { body, param } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');

const router = express.Router();

router.use(authController.verifyToken);

// /chats => POST
router.get('/', asyncHandler(chatController.getChatsMetadata));

// /chats/privateChats => POST
router.post(
  '/privateChats',
  body('otherUserName').trim().not().isEmpty(),
  asyncHandler(chatController.openPrivateChat)
);

// /chats/groups => POST
router.post(
  '/groups',
  body('groupName').trim().not().isEmpty(),
  asyncHandler(chatController.openGroup)
);

// /chats/groups/:chatId/members => GET
router.get(
  '/groups/:chatId/members',
  param('chatId').isInt(),
  asyncHandler(chatController.getGroupMembers)
);

// /chats/groups/:chatId/members/me => DELETE
router.delete(
  '/groups/:chatId/members/me',
  param('chatId').isInt(),
  asyncHandler(chatController.leaveGroup)
);

// /chats/groups/:chatId/members/:otherUserName => POST
router.post(
  '/groups/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  asyncHandler(chatController.addUserToGroup)
);

// /chats/groups/:chatId/members/:otherUserName => DELETE
router.delete(
  '/groups/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  asyncHandler(chatController.removeUserFromGroup)
);

// /chats/:chatId/messages => GET
router.get(
  '/:chatId/messages',
  param('chatId').isInt(),
  asyncHandler(chatController.getChatMessages)
);

// /chats/:chatId/messages => POST
router.post(
  '/:chatId/messages',
  param('chatId').isInt(),
  body('message').trim().not().isEmpty(),
  asyncHandler(chatController.sendMessage)
);

module.exports = router;
