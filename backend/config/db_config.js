const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config({ path: '../.env' });

const sequelize = new Sequelize('krishi_sahayata', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});

// const sequelize = new Sequelize('krishi_sahayata', 'root', '', {
//     dialect: 'mariadb',
//     host: 'localhost',
//     port: 3306,
//     dialectOptions: {
//         charset: 'utf8mb4',
//     },
// });


module.exports = sequelize;
