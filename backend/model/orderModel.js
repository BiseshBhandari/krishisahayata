const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    
    paymentStatus: {
        type: DataTypes.ENUM("Pending", "Paid", "Failed"),
        defaultValue: "Pending",
    },
    orderStatus: {
        type: DataTypes.ENUM("Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"),
        defaultValue: "Pending",
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
    {
        timestamps: true
    });


module.exports = Order;
