const express = require('express');
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');

const router = express.Router();

router.use(authController.verifyToken);

// /chats => POST
router.get('/', chatController.getChatsMetadata);

// /chats/privateChats => POST
router.post('/privateChats', chatController.openPrivateChat);

// /chats/groups => POST
router.post('/groups', chatController.openGroup);

// /chats/groups/:chatId/members => GET
router.get('/groups/:chatId/members', chatController.getGroupMembers);

// /chats/groups/:chatId/members => POST
router.post('/groups/:chatId/members', chatController.addUserToGroup);

// /chats/groups/:chatId/members => DELETE
router.delete('/groups/:chatId/members', chatController.removeUserFromGroup);

// /chats/groups/:chatId/members/me => DELETE
router.delete('/groups/:chatId/members/me', chatController.leaveGroup);

// /chats/:chatId/messages => GET
router.get('/:chatId/messages', chatController.getChatMessages);

// /chats/:chatId/messages => POST
router.post('/:chatId/messages', chatController.sendMessage);

module.exports = router;
