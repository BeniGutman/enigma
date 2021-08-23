const express = require('express');
const { body, param } = require('express-validator/check');
const asyncHandler = require('express-async-handler');
const groupController = require('../controllers/group');

const router = express.Router();

// GET /chats/groups
router.get('/', asyncHandler(groupController.getGroupsMetadata));

// POST /chats/groups
router.post(
  '/',
  body('groupName').trim().not().isEmpty(),
  asyncHandler(groupController.openGroup)
);

// GET /chats/groups/:chatId/members
router.get(
  '/:chatId/members',
  param('chatId').isInt(),
  asyncHandler(groupController.getGroupMembers)
);

// DELETE /chats/groups/:chatId/members/me
router.delete(
  '/:chatId/members/me',
  param('chatId').isInt(),
  asyncHandler(groupController.leaveGroup)
);

// POST /chats/groups/:chatId/members/:otherUserName
router.post(
  '/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  asyncHandler(groupController.addUserToGroup)
);

// DELETE /chats/groups/:chatId/members/:otherUserName
router.delete(
  '/:chatId/members/:otherUserName',
  param('chatId').isInt(),
  param('otherUserName').trim().not().isEmpty(),
  asyncHandler(groupController.removeUserFromGroup)
);

module.exports = router;
