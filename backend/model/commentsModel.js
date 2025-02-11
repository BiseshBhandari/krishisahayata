const sequelize = require("../config/db_config");
const { DataTypes } = require("sequelize");
const Post = require("./Post");
const User = require("./User");

const Comment = sequelize.define("Comment", {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: "post_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: "comments",
        timestamps: true,
    }
);

module.exports = Comment;
