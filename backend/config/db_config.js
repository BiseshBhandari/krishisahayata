const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, '', {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

module.exports = sequelize;
