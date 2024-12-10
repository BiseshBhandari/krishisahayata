const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/db_config');
const User = require('./model/userModel')

dotenv.config({ path: './.env' });
const app = express();

sequelize.authenticate().then(() => {
    console.log('Connection established with database');
}).catch((error) => {
    console.error(`Problem while making Connection with database: ${error}`);
});

app.listen(process.env.PORT, () => {
    console.log('Server setup done')
})