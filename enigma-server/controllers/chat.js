const { Op } = require('sequelize');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const Chat = require('../models/chat');
const PrivateChat = require('../models/private-chat');
const Group = require('../models/group');

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

const createNewGroup = async (ownerId, groupName) => {
  const newChat = await Chat.create({
    openDate: new Date(),
    isGroup: true,
  });

  const newGroup = await newChat.createGroup({
    name: groupName,
    ownerId,
  });

  return newGroup;
};

const isUserInPrivateChat = (user, privateChat) => {
  return (
    privateChat.firstUserId === user.id || privateChat.secondUserId === user.id
  );
};

const isUserInGroup = async (user, group) => {
  if (await group.hasMember(user)) {
    return true;
  }
  return false;
};

const isUserInChat = async (user, chat) => {
  if (chat.isGroup) {
    return isUserInGroup(user, await chat.getGroup());
  }
  return isUserInPrivateChat(user, await chat.getPrivateChat());
};

exports.getChatsMetadata = async (req, res) => {
  const { userId } = req;
  const user = await User.findByPk(userId);

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

  let groups = await user.getGroups({
    attributes: ['chatId', 'name'],
    joinTableAttributes: [],
  });

  privateChats = privateChats.map((privateChat) => ({
    ...privateChat.dataValues,
    messages: [],
  }));

  groups = groups.map((group) => ({
    ...group.dataValues,
    messages: [],
    members: [],
  }));

  const results = { groups, privateChats };
  return res.send(results);
};

exports.openPrivateChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { otherUserName } = req.body;
  const otherUser = await User.findOne({ where: { userName: otherUserName } });

  if (!otherUser) {
    return res
      .status(422)
      .send({ error: `no such user with userName: ${otherUserName}` });
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

exports.openGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { groupName } = req.body;

  const [user, newGroup] = await Promise.all([
    User.findByPk(userId),
    createNewGroup(userId, groupName),
  ]);
  await newGroup.addMember(user);
  return res.status(201).send({ chatId: newGroup.chatId });
};

exports.getGroupMembers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId } = req.params;
  const [user, group] = await Promise.all([
    User.findByPk(userId),
    Group.findOne({ where: { chatId } }),
  ]);

  if (!group) {
    return res.status(404).send({ error: 'no such group' });
  }

  if (!(await isUserInGroup(user, group))) {
    return res.status(401).send({ error: 'you are not in this group' });
  }

  const results = await group.getMembers({
    attributes: ['userName'],
    joinTableAttributes: [],
  });

  return res.send(results);
};

exports.leaveGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId } = req.params;
  const [user, group] = await Promise.all([
    User.findByPk(userId),
    Group.findOne({ where: { chatId } }),
  ]);

  if (!group) {
    return res.status(404).send({ error: 'no such group' });
  }

  await group.removeMember(user);

  return res.status(201).send({ success: true });
};

exports.addUserToGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId, otherUserName } = req.params;

  const [group, otherUser] = await Promise.all([
    Group.findOne({ where: { chatId } }),
    User.findOne({ where: { userName: otherUserName } }),
  ]);

  if (!group) {
    return res.status(404).send({ error: 'no such group' });
  }

  // check if the user own the group
  if (group.ownerId !== userId) {
    return res
      .status(401)
      .send({ error: 'you are not the owner of this group' });
  }

  if (!otherUser) {
    return res
      .status(404)
      .send({ error: `no such user with userName: ${otherUserName}` });
  }

  if (await isUserInGroup(otherUser, group)) {
    return res.status(400).send({ error: 'user already in the group' });
  }

  // add the other user to the group
  await group.addMember(otherUser);

  return res.status(201).send({ success: true });
};

exports.removeUserFromGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId, otherUserName } = req.params;

  const [group, otherUser] = await Promise.all([
    Group.findOne({ where: { chatId } }),
    User.findOne({ where: { userName: otherUserName } }),
  ]);

  if (!group) {
    return res.status(404).send({ error: 'no such group' });
  }

  // check if the user own the group
  if (group.ownerId !== userId) {
    return res
      .status(401)
      .send({ error: 'you are not the owner of this group' });
  }

  await group.removeMember(otherUser);

  return res.status(201).send({ success: true });
};

exports.getChatMessages = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId } = req.params;

  const [user, chat] = await Promise.all([
    User.findByPk(userId),
    Chat.findByPk(chatId),
  ]);

  if (!chat) {
    return res.status(404).send({ error: 'no such chat' });
  }

  if (!(await isUserInChat(user, chat))) {
    return res.status(401).send({ error: 'you are not in this chat' });
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
    return res.status(422).json(errors);
  }

  const { userId } = req;
  const { chatId } = req.params;
  const { message } = req.body;

  const [user, chat] = await Promise.all([
    User.findByPk(userId),
    Chat.findByPk(chatId),
  ]);

  if (!chat) {
    return res.status(404).send({ error: 'no such chat' });
  }

  if (!(await isUserInChat(user, chat))) {
    return res.status(401).send({ error: 'you are not in this chat' });
  }

  await chat.createMessage({
    timestamp: new Date(),
    senderId: userId,
    message,
  });

  return res.status(201).send({ success: true });
};
