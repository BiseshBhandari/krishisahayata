const sequelize = require("../config/db_config");
const { DataTypes } = require('sequelize');

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'posts',
    timestamps: false,
});

module.exports = Post;