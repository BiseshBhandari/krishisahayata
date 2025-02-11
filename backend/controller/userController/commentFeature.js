const Comment = require("../../model/commentsModel");

exports.addComment = async (req, res) => {
    try {
        const { post_id, user_id, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is missing" });
        }

        const newComment = await Comment.create({
            post_id,
            user_id,
            content,
        });

        return res.status(201).json({
            message: "Comment added successfully",
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




