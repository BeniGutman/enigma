const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Chat = sequelize.define('chat', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  openDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  isGroup: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Chat;
