const sequelize = require("../config/db_config");
const { DataTypes } = require('sequelize');


// Defining the User model
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'farmer'),
        defaultValue: 'farmer',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;
