const Sequelize = require('sequelize');
//const { toDefaultValue } = require('sequelize/types/utils');

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
  ispremiumuser : Sequelize.BOOLEAN,
  totalExpenses:{
     type: Sequelize.INTEGER,
     defaultValue : 0
  } 
});

module.exports = User;