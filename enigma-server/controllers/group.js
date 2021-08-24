const User = require('../models/user');
const Chat = require('../models/chat');
const Group = require('../models/group');

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

exports.isUserInGroup = async (user, group) => {
  if (await group.hasMember(user)) {
    return true;
  }
  return false;
};

exports.getGroupsMetadata = async (req, res) => {
  const { userId } = req;
  const user = await User.findByPk(userId);

  let groups = await user.getGroups({
    attributes: ['chatId', 'name'],
    joinTableAttributes: [],
  });

  groups = groups.map((group) => ({
    ...group.dataValues,
    messages: [],
    members: [],
  }));

  return res.send(groups);
};

exports.openGroup = async (req, res) => {
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
  const { userId } = req;
  const { chatId } = req.params;
  const [user, group] = await Promise.all([
    User.findByPk(userId),
    Group.findOne({ where: { chatId } }),
  ]);

  if (!group) {
    const error = new Error('no such group');
    error.statusCode = 404;
    throw error;
  }

  if (!(await exports.isUserInGroup(user, group))) {
    const error = new Error('you are not in this group');
    error.statusCode = 401;
    throw error;
  }

  const results = await group.getMembers({
    attributes: ['userName'],
    joinTableAttributes: [],
  });

  return res.send(results);
};

exports.leaveGroup = async (req, res) => {
  const { userId } = req;
  const { chatId } = req.params;
  const [user, group] = await Promise.all([
    User.findByPk(userId),
    Group.findOne({ where: { chatId } }),
  ]);

  if (!group) {
    const error = new Error('no such group');
    error.statusCode = 404;
    throw error;
  }

  await group.removeMember(user);

  return res.status(201).send({ success: true });
};

exports.addUserToGroup = async (req, res) => {
  const { userId } = req;
  const { chatId, otherUserName } = req.params;

  const [group, otherUser] = await Promise.all([
    Group.findOne({ where: { chatId } }),
    User.findOne({ where: { userName: otherUserName } }),
  ]);

  if (!group) {
    const error = new Error('no such group');
    error.statusCode = 404;
    throw error;
  }

  // check if the user own the group
  if (group.ownerId !== userId) {
    const error = new Error('you are not the owner of this group');
    error.statusCode = 403;
    throw error;
  }

  if (!otherUser) {
    const error = new Error(`no such user with userName: ${otherUserName}`);
    error.statusCode = 404;
    throw error;
  }

  if (await exports.isUserInGroup(otherUser, group)) {
    const error = new Error('user already in the group');
    error.statusCode = 400;
    throw error;
  }

  // add the other user to the group
  await group.addMember(otherUser);

  return res.status(201).send({ success: true });
};

exports.removeUserFromGroup = async (req, res) => {
  const { userId } = req;
  const { chatId, otherUserName } = req.params;

  const [group, otherUser] = await Promise.all([
    Group.findOne({ where: { chatId } }),
    User.findOne({ where: { userName: otherUserName } }),
  ]);

  if (!group) {
    const error = new Error('no such group');
    error.statusCode = 404;
    throw error;
  }

  // check if the user own the group
  if (group.ownerId !== userId) {
    const error = new Error('you are not the owner of this group');
    error.statusCode = 403;
    throw error;
  }

  await group.removeMember(otherUser);

  return res.status(201).send({ success: true });
};
