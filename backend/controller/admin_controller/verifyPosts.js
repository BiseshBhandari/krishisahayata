const Post = require('../../model/postModel');

exports.getPendingPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { approval_status: 'pending' },
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No pending posts' });
        }

        return res.status(200).json({ post: posts });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
exports.approvePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { status } = req.body;
        
        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        if (!status) {
            return res.status(400).json({ message: "Approval status is required" });
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.approval_status = status;
        await post.save();

        return res.status(200).json({ message: `Post status updated to ${status} successfully` });

    } catch (error) {
        console.error("Error updating post status:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
