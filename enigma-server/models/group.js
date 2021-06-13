const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Group = sequelize.define(
  'group',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    chatId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ownerId: {
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
        fields: ['ownerId'],
      },
    ],
  }
);

module.exports = Group;
