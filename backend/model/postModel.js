const sequelize = require("../config/db_config");
const { DataTypes } = require("sequelize");
const User = require('./userModel')

const Post = sequelize.define("Post", {
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    approval_status: {
        type: DataTypes.ENUM("pending", "approved", "disapproved"),
        defaultValue: "pending",
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: "Post",
        timestamps: true,
    }
);

module.exports = Post;
