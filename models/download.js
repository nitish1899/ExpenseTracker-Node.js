const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const downloadedFiles = sequelize.define('download',{
    id: {
       type: Sequelize.UUID,
       allowNull:false,
       primaryKey:true
    },
    fileUrl: Sequelize.STRING
});

module.exports = downloadedFiles;