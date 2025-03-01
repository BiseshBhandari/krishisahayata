const sequelize = require("../config/db_config");
const { DataTypes } = require('sequelize');
const User = require('./userModel');

// Defining the Tutorial model
const Tutorial = sequelize.define('Tutorial', {
    tutorial_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: User,
        //     key: 'user_id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Tutorial',
    timestamps: false,
});

module.exports = Tutorial;
