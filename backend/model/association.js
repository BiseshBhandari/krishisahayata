const User = require("./userModel");
const Post = require("./postModel");

// Defining the association between User and Video

// Defining the association between User and Post
User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Defining the association between User and Comment

// Defining the association between Post and Comment
module.exports = { User, Post };
