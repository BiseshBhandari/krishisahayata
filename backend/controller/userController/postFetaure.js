const { Post, User, Like } = require('../../model/association');
const sequelize = require("../../config/db_config");
const path = require("path");
const fs = require("fs");

exports.addPost = async (req, res) => {
    try {
        const { content } = req.body;
        const { user_id } = req.params;

        if (!content) {
            return res.status(400).json({ message: "Content of the Post required" });
        }

        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const imageFile = req.files?.image;

        let image_url = null;

        if (imageFile) {
            if (imageFile.size > 10 * 1024 * 1024) {
                return res.status(400).json({ message: "File size exceeds the 10MB limit" });
            }

            const uploadDir = path.join(__dirname, "../../uploads/postImages/");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const imageName = `${Date.now()}_${imageFile.name}`;
            const savePath = path.join(uploadDir, imageName);
            await imageFile.mv(savePath);

            image_url = `/uploads/postImages/${imageName}`;
        }

        const newPost = await Post.create({
            user_id,
            content,
            image_url,
        });

        return res.status(201).json({
            message: "Post added successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error adding post:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                approval_status: 'approved',
            },
            attributes: {
                include: [
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM Comment AS c WHERE c.post_id = Post.post_id
                    )`), 'commentCount'],
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM \`Like\` AS l WHERE l.post_id = Post.post_id
                    )`), 'likeCount'],
                ],
            },
            include: {
                model: User,
                attributes: ["user_id", "name", "profile_image_url"],
            },
            order: [['created_at', 'DESC']],
        });

        // console.log("Fetched posts:", posts);
        return res.status(200).json({ posts }); // Changed 'post' to 'posts' for consistency
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.getUserPost = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User not logged in" });
        }

        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.findAll({
            where: {
                user_id,
            },
            attributes: {
                include: [
                    // Count the number of comments
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM Comment AS c WHERE c.post_id = Post.post_id
                    )`), 'commentCount'],

                    // Count the number of likes
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM \`Like\` AS l WHERE l.post_id = Post.post_id
                    )`), 'likeCount']
                ]
            },
            include: [
                {
                    model: User,
                    attributes: ["user_id", "name", "profile_image_url"]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        // console.log("fetchedpost:", posts);
        return res.status(200).json({ userPosts: posts });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.editPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { content } = req.body;
        const imageFile = req.files?.image;

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (imageFile) {
            if (post.image_url) {
                const oldImagePath = path.join(__dirname, '../../', post.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const uploadDir = path.join(__dirname, '../../uploads/postPhotos');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `${Date.now()}_${imageFile.name}`;
            const filepath = path.join(uploadDir, filename);

            await imageFile.mv(filepath); // move file

            post.image_url = `/uploads/postPhotos/${filename}`;
        }

        if (content) {
            post.content = content;
        }

        await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;

        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.image_url) {
            const filePath = path.join(__dirname, '../../', post.image_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await post.destroy();
        return res.status(200).json({ message: "Post and associated image deleted successfully" });

    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.likeUnlikePost = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likeExists = await Like.findOne({ where: { post_id, user_id } });

        if (likeExists) {
            await likeExists.destroy();
            return res.status(200).json({ post_id: post_id, liked: false, message: "Post unliked successfully" });
        }

        await Like.create({ post_id, user_id });
        return res.status(200).json({ post_id: post_id, liked: true, message: "Post liked successfully" });

    } catch (error) {
        console.error("Error liking/unliking post:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.getLikedPosts = async (req, res) => {
    try {
        const { user_id } = req.params;

        const likedPosts = await Like.findAll({
            where: { user_id },
            include: {
                model: Post,
                attributes: ['post_id'],
            },
        });

        if (!likedPosts || likedPosts.length === 0) {
            return res.status(404).json({ message: "No liked posts found" });
        }

        const posts = likedPosts.map(like => like.Post);

        return res.status(200).json({ likedPost: posts });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


