const User = require("./userModel");
const Post = require("./postModel");
const Video = require("./videoModel");
const Product = require("./productModel");

// Defining the association between User and Video
User.hasMany(Video, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Video.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between User and Post
User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between User and Product
User.hasMany(Product, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" });
Product.belongsTo(User, { foreignKey: "user_ID", onDelete: "CASCADE", onUpdate: "CASCADE" })



// Defining the association between Post and Comment
module.exports = { User, Post, Product };
