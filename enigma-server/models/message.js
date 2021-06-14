const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define(
  'message',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    chatId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    senderId: {
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
        fields: ['senderId'],
      },
    ],
  }
);

module.exports = Message;
