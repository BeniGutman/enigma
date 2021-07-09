const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const PrivateChat = sequelize.define(
  'privateChat',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    chatId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    firstUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    secondUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ['chatId'],
      },
      {
        unique: false,
        fields: ['firstUserId'],
      },
      {
        unique: false,
        fields: ['secondUserId'],
      },
    ],
  }
);

module.exports = PrivateChat;
