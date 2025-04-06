const cloudinary = require('../../config/cloudinary_config');
const { Post, User, Like } = require('../../model/association');
const sequelize = require("../../config/db_config");


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

        const imageFile = req.files.image;
        console.log(imageFile);

        if (imageFile.size > 10 * 1024 * 1024) {
            return res.status(400).json({ message: "File size exceeds the 10MB limit" });
        }

        let imageUrl = null;

        cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "krishi_sahayata_post_images" },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ message: "Error uploading image", error: error.message });
                }

                imageUrl = result.secure_url;

                const newPost = await Post.create({
                    user_id,
                    content,
                    image_url: imageUrl,
                });

                return res.status(201).json({
                    message: "Post added successfully",
                    post: newPost,
                });
            }
        ).end(imageFile.data);

    } catch (error) {
        console.error("Error adding post:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { approval_status: 'approved' },
            attributes: {
                include: [
                    // Count the number of comments
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM Comment AS c WHERE c.post_id = Post.post_id
                    )`), 'commentCount'],

                    // Count the number of likes (escaping `Like` as it is a reserved keyword)
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM \`Like\` AS l WHERE l.post_id = Post.post_id
                    )`), 'likeCount']
                ]
            },
            include: {
                model: User,
                attributes: ["user_id", "name"]
            },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({ post: posts });

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
            where: { user_id, 'approval_status': 'approved' },
            include: {
                model: User,
                attributes: ["user_id", "name"],
            }
        });

        return res.status(200).json({ post: posts });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

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

            const publicIdMatch = post.image_url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            const publicId = publicIdMatch ? publicIdMatch[1] : null;

            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            }
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


