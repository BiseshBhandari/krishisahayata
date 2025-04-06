import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { BiLike, BiShareAlt } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader";
import { usePostStore } from "../../Store/usePostStore";
import { useCommentStore } from "../../Store/useCommentStore";
import { useLikeStore } from "../../Store/useLikeStore"; // Import the like store
import "../../Styles/PostPage.css";

function PostPage() {
    const [formData, setFormData] = useState({ content: "", file: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activePostId, setActivePostId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState({});

    const { addPost, fetchAllPosts, allPosts, loading } = usePostStore();
    const { fetchComments, addComment, deleteComment, comments, commentLoading, replyToComment } = useCommentStore();
    const { likedPosts, fetchLikedPosts, likeLoading, likeError, likeUnlikePost } = useLikeStore();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userID");
        if (storedUserId) {
            setUserId(storedUserId);
            fetchLikedPosts(storedUserId);
        }
        fetchAllPosts();
    }, [fetchAllPosts, fetchLikedPosts]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, file });
            if (selectedImage) URL.revokeObjectURL(selectedImage);
            setSelectedImage(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) return toast.error("Post content is required");
        if (!userId) return toast.error("User not found. Please log in again.");

        const postData = new FormData();
        postData.append("content", formData.content);
        if (formData.file) postData.append("image", formData.file);

        try {
            await addPost(postData, userId);
            toast.success("Post added successfully");
            setFormData({ content: "", file: null });
            setSelectedImage(null);
            fetchAllPosts();
        } catch (err) {
            toast.error("Failed to add post");
        }
    };

    const handleCommentToggle = async (postId) => {
        setNewComment("");
        if (activePostId === postId) {
            setActivePostId(null);
        } else {
            await fetchComments(postId);
            setActivePostId(postId);
        }
    };

    const handleAddComment = async (postId) => {
        if (newComment.trim()) {
            await addComment({ userId, postId, comment: newComment });
            setNewComment("");
            await fetchComments(postId);
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        await deleteComment(commentId);
        await fetchComments(postId);
    };

    const handleReplyChange = (commentId, value) => {
        setReplyContent((prev) => ({ ...prev, [commentId]: value }));
    };

    const handleReplySubmit = async (commentId, postId) => {
        const reply = replyContent[commentId];
        if (reply.trim()) {
            await replyToComment({ commentId, userId, reply });
            setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
            await fetchComments(postId);
        }
    };

    const handleReplyToggle = (commentId) => {
        if (activeCommentId === commentId) {
            setActiveCommentId(null);
        } else {
            setActiveCommentId(commentId);
        }
    };

    const handleLikePost = async (postId) => {
        if (!userId) {
            toast.error("User not found. Please log in again.");
            return;
        }
        await likeUnlikePost({ userId, postId });
        fetchAllPosts();
    };

    return (
        <div className="post_page">
            <ToastContainer />
            {loading && <Loader display_text="Posting..." />}

            <div className="post_container_1">
                <div className="postform">
                    <div className="postFormHeader">
                        <h1 className="post_form_header_h1">Create Post</h1>
                    </div>
                    <div className="PostformContainer">
                        <div className="userProfile_photo">
                            <img className="profile_image" src="" alt="Profile" />
                        </div>
                        <div className="PostformFileds">
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    name="content"
                                    placeholder="Write a post"
                                    className="Post_content"
                                    value={formData.content}
                                    onChange={handleChange}
                                />
                                <div className="post_actions">
                                    <label htmlFor="file" className="file-upload">
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Selected" className="preview-image" />
                                        ) : (
                                            <>
                                                <FaCamera className="upload-icon" />
                                                <span>Upload Image</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            id="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            hidden
                                        />
                                    </label>
                                    <button type="submit" className="Post_submit_button">
                                        Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Posts Section */}
            <div className="post_container_2">
                <div className="allPosts">
                    {allPosts.length > 0 ? (
                        allPosts.map((post) => {
                            const isLiked = likedPosts.includes(post.post_id);
                            return (
                                <div key={post.post_id} className="post_list">
                                    <div className="post_Header">
                                        <div className="Post_user_proile_image"></div>
                                        <div className="post_user_name">
                                            {post.User?.name || "Unknown User"}
                                        </div>
                                    </div>
                                    <p className="Post_contnent_p">{post.content}</p>
                                    {post.image_url && (
                                        <div className="posted_image">
                                            <img src={post.image_url} alt="Post" className="post-image" />
                                        </div>
                                    )}
                                    <div className="post_footer_actions">
                                        <button
                                            className={`like_button ${isLiked ? "liked" : ""}`}
                                            onClick={() => handleLikePost(post.post_id)}
                                        >
                                            <BiLike size={28} />
                                        </button>
                                        <span>{post.likeCount}</span>
                                        <button
                                            className="comment_button"
                                            onClick={() => handleCommentToggle(post.post_id)}
                                        >
                                            <FaRegComment size={28} />
                                            {post.commentCount > 0 && (
                                                <span className="comment_count_badge">{post.commentCount}</span>
                                            )}
                                        </button>
                                        <button className="share_button">
                                            <BiShareAlt size={28} />
                                        </button>
                                    </div>

                                    {/* Comment Section */}
                                    {activePostId === post.post_id && (
                                        <div className="comment_section">
                                            <div className="comment_list">
                                                {commentLoading ? (
                                                    <p>Loading comments...</p>
                                                ) : comments.length > 0 ? (
                                                    comments.map((comment) => (
                                                        <div key={comment.comment_id} className="comment_item">
                                                            <div className="comment_text">
                                                                <strong>{comment.User?.name || "Unknown"}:</strong> {comment.comment}
                                                            </div>
                                                            <div className="comment_actions">
                                                                {comment.user_id == userId && (
                                                                    <button
                                                                        onClick={async () => {
                                                                            await handleDeleteComment(comment.comment_id, post.post_id);
                                                                            await fetchAllPosts();
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleReplyToggle(comment.comment_id)} >
                                                                    replies
                                                                </button>
                                                            </div>

                                                            {/* Reply Input */}
                                                            {activeCommentId == comment.comment_id && (
                                                                <div className="replty_section_hero">
                                                                    {comment.Replies && (
                                                                        <div className="replies_section">
                                                                            {comment.Replies.map((reply) => (
                                                                                <div key={reply.reply_id} className="reply_item">
                                                                                    <strong>{reply.User?.name || "Unknown"}:</strong> {reply.reply}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    <div className="reply_section">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Write a reply..."
                                                                            value={replyContent[comment.comment_id] || ""}
                                                                            onChange={(e) =>
                                                                                handleReplyChange(comment.comment_id, e.target.value)
                                                                            }
                                                                        />
                                                                        <button
                                                                            onClick={() => handleReplySubmit(comment.comment_id, post.post_id)}
                                                                        >
                                                                            Reply
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No comments yet.</p>
                                                )}
                                            </div>
                                            <div className="add_comment_box">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        await handleAddComment(post.post_id);
                                                        await fetchAllPosts();
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </div>

            <div className="post_container_3"></div>
        </div>
    );
}

export default PostPage;
