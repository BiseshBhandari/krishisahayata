const User = require("./userModel");
const Post = require("./postModel");
const Video = require("./videoModel");
const Product = require("./productModel");
const Cart = require("./cartModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");

// Defining the association between User and Video
User.hasMany(Video, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" });
Video.belongsTo(User, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between User and Post
User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between User and Product
User.hasMany(Product, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" });
Product.belongsTo(User, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" })

//association between user, product and cart
User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });

Product.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE", onUpdate: "CASCADE" });


Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE", onUpdate: "CASCADE" });


OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE", onUpdate: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between Post and Comment
module.exports = { User, Post, Product, Cart, Video, Order, OrderItem };
