const { Op } = require('sequelize');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const Chat = require('../models/chat');
const PrivateChat = require('../models/private-chat');

const createNewPrivateChat = async (firstUserId, secondUserId) => {
  const newChat = await Chat.create({
    openDate: new Date(),
    isGroup: false,
  });

  const newPrivateChat = await newChat.createPrivateChat({
    firstUserId,
    secondUserId,
  });

  return newPrivateChat;
};

exports.isUserInPrivateChat = (user, privateChat) => {
  return (
    privateChat.firstUserId === user.id || privateChat.secondUserId === user.id
  );
};

exports.getPrivateChatsMetadata = async (req, res) => {
  const { userId } = req;

  let privateChats = await PrivateChat.findAll({
    where: {
      [Op.or]: [{ firstUserId: userId }, { secondUserId: userId }],
    },
    attributes: ['chatId'],
    include: [
      {
        model: User,
        as: 'firstUser',
        attributes: ['userName'],
      },
      {
        model: User,
        as: 'secondUser',
        attributes: ['userName'],
      },
    ],
  });

  privateChats = privateChats.map((privateChat) => ({
    ...privateChat.dataValues,
    messages: [],
  }));

  return res.send(privateChats);
};

exports.openPrivateChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { userId } = req;
  const { otherUserName } = req.body;
  const otherUser = await User.findOne({ where: { userName: otherUserName } });

  if (!otherUser) {
    const error = new Error(`no such user with userName: ${otherUserName}`);
    error.statusCode = 404;
    throw error;
  }

  let privateChat = await PrivateChat.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ firstUserId: userId }, { secondUserId: otherUser.id }],
        },
        {
          [Op.and]: [{ firstUserId: otherUser.id }, { secondUserId: userId }],
        },
      ],
    },
  });

  if (!privateChat) {
    privateChat = await createNewPrivateChat(userId, otherUser.id);
  }

  return res.status(201).send({ chatId: privateChat.chatId });
};
