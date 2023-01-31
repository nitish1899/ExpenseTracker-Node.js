const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique : true
  },
  password:Sequelize.STRING,
  phNo : Sequelize.STRING,
  ispremiumuser : Sequelize.BOOLEAN
});

module.exports = User;