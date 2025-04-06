const sequelize = require("../config/db_config");
const { DataTypes } = require("sequelize");

const Like = sequelize.define("Like", {
    like_id: {
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "Like",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['post_id', 'user_id'],
        },
    ],
});

module.exports = Like;
