const express = require('express');
const { body, param } = require('express-validator/check');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');

const router = express.Router();

router.use(authController.verifyToken);

// /chats => POST
router.get('/', chatController.getChatsMetadata);

// /chats/privateChats => POST
router.post(
  '/privateChats',
  body('otherUserName').trim().not().isEmpty(),
  chatController.openPrivateChat
);

// /chats/groups => POST
router.post(
  '/groups',
  body('groupName').trim().not().isEmpty(),
  chatController.openGroup
);

// /chats/groups/:chatId/members => GET
router.get(
  '/groups/:chatId/members',
  param('chatId').isInt(),
  chatController.getGroupMembers
);

// /chats/groups/:chatId/members => POST
router.post(
  '/groups/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  chatController.addUserToGroup
);

// /chats/groups/:chatId/members => DELETE
router.delete(
  '/groups/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  chatController.removeUserFromGroup
);

// /chats/groups/:chatId/members/me => DELETE
router.delete(
  '/groups/:chatId/members/me',
  param('chatId').isInt(),
  chatController.leaveGroup
);

// /chats/:chatId/messages => GET
router.get(
  '/:chatId/messages',
  param('chatId').isInt(),
  chatController.getChatMessages
);

// /chats/:chatId/messages => POST
router.post(
  '/:chatId/messages',
  param('chatId').isInt(),
  body('message').trim().not().isEmpty(),
  chatController.sendMessage
);

module.exports = router;
