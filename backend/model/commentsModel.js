const sequelize = require("../config/db_config");
const { DataTypes } = require("sequelize");

const Comment = sequelize.define("Comment", {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "Comment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

module.exports = Comment;
