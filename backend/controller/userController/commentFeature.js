const { Comment, Post, User, Reply } = require("../../model/association");

exports.addComment = async (req, res) => {
    try {
        const { userId, postId, comment } = req.body;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = await Comment.create({
            user_id: userId,
            post_id: postId,
            comment: comment,
        });

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ error: "Error adding comment" });
    }
}

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Reply,
                    attributes: ['reply_id', 'reply', 'created_at'], 
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: "No comments found for this post" });
        }

        res.status(200).json({
            success: true,
            commentCount: comments.length,
            comments
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
};


exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await comment.destroy();

        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting comment" });
    }
}

exports.replyToComment = async (req, res) => {
    try {
        const { commentId, user_id, reply } = req.body;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const newReply = await Reply.create({
            user_id: user_id,
            comment_id: commentId,
            reply: reply,
        });

        res.status(201).json({ success: true, reply: newReply });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Error replying to comment" });
    }
};

