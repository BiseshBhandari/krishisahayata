const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const sequelize = require('./config/db_config');

const User = require('./model/userModel')
require('./model/association');

dotenv.config({ path: './.env' });

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log(__dirname);

app.use('/auth', require('./routes/authRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/farmer', require('./routes/farmerRoutes'));

sequelize.authenticate().then(() => {
    console.log('Connection established with database');
    // sequelize.sync({ alter: true });
}).catch((error) => {
    console.error(`Problem while making Connection with database: ${error}`);
});

app.listen(process.env.PORT, () => {
    console.log('Server setup done')
})