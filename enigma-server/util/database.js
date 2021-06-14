const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'enigmadbpassword', {
  dialect: 'postgres',
  host: 'localhost',
});

module.exports = sequelize;
