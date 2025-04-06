const sequelize = require("../config/db_config");
const { DataTypes } = require("sequelize");

const Reply = sequelize.define("Reply", {
  reply_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Reply",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

module.exports = Reply;
