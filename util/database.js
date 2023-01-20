// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'nitishdb',
//   password: 'Nitish@1899'
// });
// module.exports = pool.promise();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('expense', 'root', 'Nitish@1899', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;