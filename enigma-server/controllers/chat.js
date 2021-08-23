const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const Chat = require('../models/chat');
const groupController = require('./group');
const privateChatController = require('./private-chat');

const isUserInChat = async (user, chat) => {
  if (chat.isGroup) {
    return groupController.isUserInGroup(user, await chat.getGroup());
  }
  return privateChatController.isUserInPrivateChat(
    user,
    await chat.getPrivateChat()
  );
};

exports.getChatMessages = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { userId } = req;
  const { chatId } = req.params;

  const [user, chat] = await Promise.all([
    User.findByPk(userId),
    Chat.findByPk(chatId),
  ]);

  if (!chat) {
    const error = new Error('no such chat');
    error.statusCode = 404;
    throw error;
  }

  if (!(await isUserInChat(user, chat))) {
    const error = new Error('you are not in this chat');
    error.statusCode = 401;
    throw error;
  }

  const messages = await chat.getMessages({
    // TODO: move the sort of messages to the client responsibility
    order: [['id', 'ASC']],
    attributes: ['id', 'timestamp', 'message', 'chatId'],
    include: { model: User, as: 'sender', attributes: ['userName'] },
  });

  return res.send(messages);
};

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { userId } = req;
  const { chatId } = req.params;
  const { message } = req.body;

  const [user, chat] = await Promise.all([
    User.findByPk(userId),
    Chat.findByPk(chatId),
  ]);

  if (!chat) {
    const error = new Error('no such chat');
    error.statusCode = 404;
    throw error;
  }

  if (!(await isUserInChat(user, chat))) {
    const error = new Error('you are not in this chat');
    error.statusCode = 401;
    throw error;
  }

  await chat.createMessage({
    timestamp: new Date(),
    senderId: userId,
    message,
  });

  return res.status(201).send({ success: true });
};
