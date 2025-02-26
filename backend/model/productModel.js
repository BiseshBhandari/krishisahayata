const sequelize = require("../config/db_config");
const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    discountPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stockStatus: {
        type: DataTypes.ENUM("in-Stock", "out-of-stock"),
        defaultValue: "in-Stock",
        allowNull: false,
    },
    approvalStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false
    },
    user_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'products',
    timestamps: false,
});

module.exports = Product;