const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat');
const PrivateChat = require('./models/private-chat');
const Group = require('./models/group');
const GroupMember = require('./models/group-member');
const Message = require('./models/message');

const app = express();

const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:4200' }));

/* routes section */
app.use('/auth', authRoutes);

/* sequelize relations */

// one to one relation between groups and chat
Chat.hasOne(Group);
Group.belongsTo(Chat, {
  foreignKey: 'chatId',
});

// define group owner
User.hasMany(Group, {
  as: 'hisGroups',
  foreignKey: 'ownerId',
});
Group.belongsTo(User, {
  as: 'owner',
  foreignKey: 'ownerId',
});

// one to one relation between private chat and chat
Chat.hasOne(PrivateChat, {
  foreignKey: 'chatId',
});
PrivateChat.belongsTo(Chat, {
  foreignKey: 'chatId',
});

// define PrivateChat user1
User.hasMany(PrivateChat, {
  foreignKey: 'firstUserId',
});
PrivateChat.belongsTo(User, {
  as: 'firstUser',
  foreignKey: 'firstUserId',
});

// define PrivateChat user2
User.hasMany(PrivateChat, {
  foreignKey: 'secondUserId',
});
PrivateChat.belongsTo(User, {
  as: 'secondUser',
  foreignKey: 'secondUserId',
});

// define groups vs users
Group.belongsToMany(User, { as: 'members', through: GroupMember });
User.belongsToMany(Group, { as: 'groups', through: GroupMember });

// message sender
User.hasMany(Message, {
  foreignKey: 'senderId',
});
Message.belongsTo(User, {
  as: 'sender',
  foreignKey: 'senderId',
});

// message in which chat
Chat.hasMany(Message, {
  foreignKey: 'chatId',
});
Message.belongsTo(Chat, {
  foreignKey: 'chatId',
});

sequelize
  // .sync()
  .sync({ force: true })
  .then((result) => {
    app.listen(5000, () => {
      console.log('listen on port 5000');
    });
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
