import React, { useState, useEffect } from "react";
import { BiImageAdd } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa6";
import { BiLike, BiShareAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader";
import { usePostStore } from "../../Store/usePostStore";
import { useCommentStore } from "../../Store/useCommentStore";
import { useLikeStore } from "../../Store/useLikeStore";
import "../../Styles/PostPage.css";

function PostPage() {
    const [formData, setFormData] = useState({ content: "", file: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activePostId, setActivePostId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState({});
    const [showUserPosts, setShowUserPosts] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [dropdownPostId, setDropdownPostId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const {
        addPost,
        fetchAllPosts,
        fetchUserPosts,
        editPost,
        deletePost,
        allPosts,
        userPosts,
        loading,
        error,
        updateLikeCount,
        updateCommentCount,
    } = usePostStore();
    const { fetchComments, addComment, deleteComment, comments, commentLoading, replyToComment } = useCommentStore();
    const { likedPosts, fetchLikedPosts, likeUnlikePost } = useLikeStore();

    const baseURL = 'http://localhost:3000';
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const storedUserId = user?.user_id;
        console.log("Stored User ID:", storedUserId);
        if (storedUserId) {
            setUserId(storedUserId);
            fetchAllPosts(storedUserId);
            fetchUserPosts(storedUserId);
        }
    }, [fetchAllPosts, fetchUserPosts]);

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

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            if (editImagePreview) URL.revokeObjectURL(editImagePreview);
            setEditImagePreview(URL.createObjectURL(file));
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
            await fetchAllPosts(userId);
            await fetchUserPosts(userId);
        } catch (err) {
            toast.error("Failed to add post");
        }
    };

    const handleEditPost = async (postId) => {
        if (!editContent.trim()) return toast.error("Post content cannot be empty");
        try {
            const postData = new FormData();
            postData.append("content", editContent);
            if (editImage) postData.append("image", editImage);

            await editPost(postId, postData);
            toast.success("Post updated successfully");
            setEditPostId(null);
            setEditContent("");
            setEditImage(null);
            if (editImagePreview) URL.revokeObjectURL(editImagePreview);
            setEditImagePreview(null);
            await fetchAllPosts(userId);
            await fetchUserPosts(userId);
        } catch (err) {
            toast.error("Failed to update post");
        }
    };

    const handleDeletePost = async (postId) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const confirmDeletePost = async () => {
        try {
            await deletePost(postToDelete);
            toast.success("Post deleted successfully");
            await fetchAllPosts(userId);
            await fetchUserPosts(userId);
            setShowDeleteModal(false);
            setPostToDelete(null);
        } catch (err) {
            toast.error("Failed to delete post");
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
            updateCommentCount(postId, 1);
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
        const isAlreadyLiked = likedPosts.includes(postId);
        await likeUnlikePost({ userId, postId });
        updateLikeCount(postId, isAlreadyLiked ? -1 : 1);
    };

    const postsToShow = showUserPosts ? userPosts : allPosts;

    return (
        <div className="post_page">
            <ToastContainer />

            <div className="post_container_1">
                <div className="postform">
                    <div className="postFormHeader">
                        <h1 className="post_form_header_h1">Create Post</h1>
                    </div>
                    <div className="PostformContainer">
                        <div className="userProfile_photo">
                            <img className="profile_image" src={`${baseURL}${user?.profile_image_url}`} alt="Profile" />
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
                                <div className="create_post_actions">
                                    <div className="image_add_section">
                                        <label htmlFor="file" className="file-upload">
                                            {selectedImage ? (
                                                <img src={selectedImage} alt="Selected" className="preview-image" />
                                            ) : (
                                                <>
                                                    <BiImageAdd color="green" size={40} />
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
                                    </div>
                                    <button type="submit" className="Post_submit_button">
                                        Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="post_container_2">
                <div className="postHeadbar">
                    <div className="post_toggle_dropdown">
                        <select
                            className="post_select_dropdown"
                            value={showUserPosts ? "myPosts" : "allPosts"}
                            onChange={(e) => {
                                const value = e.target.value;
                                setShowUserPosts(value === "myPosts");
                                if (value === "myPosts" && userId) {
                                    fetchUserPosts(userId);
                                } else {
                                    fetchAllPosts(userId);
                                }
                            }}
                        >
                            <option value="allPosts">All Posts</option>
                            <option value="myPosts">My Posts</option>
                        </select>
                    </div>
                </div>

                <div className="allPosts">
                    {loading ? (
                        <Loader display_text="Loading posts..." />
                    ) : error ? (
                        <p>{error === "No approved posts available" ? "No approved posts available" : `Post Not found`}</p>
                    ) : postsToShow.length > 0 ? (
                        postsToShow.map((post) => {
                            const isLiked = likedPosts.includes(post.post_id);
                            const isOwner = post.user_id === userId;

                            return (
                                <div key={post.post_id} className="post_list">
                                    <div className="post_Header">
                                        <div className="Post_user_profile_image">
                                            <img
                                                src={`${baseURL}${post.User?.profile_image_url}`}
                                                alt="User"
                                                className="post_user_image"
                                            />
                                        </div>
                                        <div className="post_user_info">
                                            <div className="post_user_name">
                                                {post.User?.name || "Unknown User"}
                                            </div>
                                            <div className="post_date">
                                                {new Date(post.created_at).toLocaleString()}
                                            </div>
                                            <div className={`post_status ${post.approval_status}`}>
                                                {post.approval_status}
                                            </div>
                                        </div>
                                        {isOwner && (
                                            <div
                                                className="post_menu"
                                                onMouseEnter={() => setDropdownPostId(post.post_id)}
                                                onMouseLeave={() => setDropdownPostId(null)}
                                            >
                                                <BsThreeDots size={24} className="menu_icon" />
                                                {dropdownPostId === post.post_id && (
                                                    <div className="dropdown_menu">
                                                        <button
                                                            className="dropdown_item"
                                                            onClick={() => {
                                                                setEditPostId(post.post_id);
                                                                setEditContent(post.content);
                                                                setEditImage(null);
                                                                setEditImagePreview(null);
                                                                setDropdownPostId(null);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="dropdown_item delete"
                                                            onClick={() => {
                                                                handleDeletePost(post.post_id);
                                                                setDropdownPostId(null);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {editPostId === post.post_id ? (
                                        <div className="edit_post_form">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="edit_post_textarea"
                                                placeholder="Edit your post..."
                                            />
                                            <div className="edit_image_section">
                                                <label htmlFor={`edit-file-${post.post_id}`} className="file-upload">
                                                    {editImagePreview ? (
                                                        <img src={editImagePreview} alt="Selected" className="preview-image" />
                                                    ) : post.image_url ? (
                                                        <img src={`${baseURL}${post.image_url}`} alt="Current" className="preview-image" />
                                                    ) : (
                                                        <>
                                                            <BiImageAdd color="green" size={40} />
                                                            <span>Upload New Image</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        id={`edit-file-${post.post_id}`}
                                                        accept="image/*"
                                                        onChange={handleEditImageChange}
                                                        hidden
                                                    />
                                                </label>
                                            </div>
                                            <div className="edit_post_actions">
                                                <button
                                                    className="edit_post_save"
                                                    onClick={() => handleEditPost(post.post_id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="edit_post_cancel"
                                                    onClick={() => {
                                                        setEditPostId(null);
                                                        setEditContent("");
                                                        setEditImage(null);
                                                        if (editImagePreview) URL.revokeObjectURL(editImagePreview);
                                                        setEditImagePreview(null);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="Post_contnent_p">{post.content}</p>
                                            {post.image_url && (
                                                <div className="posted_image">
                                                    <img src={`${baseURL}${post.image_url}`} alt="Post" className="post-image" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="post_footer_actions">
                                        <div className="post_actions">
                                            <button
                                                className={`like_button ${isLiked ? "liked" : ""}`}
                                                onClick={() => handleLikePost(post.post_id)}
                                            >
                                                <BiLike size={28} />
                                                {post.likeCount > 0 && (
                                                    <span className="like_count_badge">{post.likeCount}</span>
                                                )}
                                            </button>
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
                                    </div>

                                    {activePostId === post.post_id && (
                                        <div className="comment_section">
                                            <div className="comment_list">
                                                {commentLoading ? (
                                                    <p>Loading comments...</p>
                                                ) : comments.length > 0 ? (
                                                    comments.map((comment) => (
                                                        <div key={comment.comment_id} className="comment_item">
                                                            <div className="comment_header">
                                                                <img
                                                                    src={`${baseURL}${comment.User?.profile_image_url}`}
                                                                    alt="User"
                                                                    className="comment_user_image"
                                                                />
                                                                <div className="comment_user_info">
                                                                    <strong className="comment_user_name">{comment.User?.name || "Unknown"}</strong>
                                                                    <br />
                                                                    <span className="comment_date">
                                                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="comment_body">
                                                                <p className="comment_text">{comment.comment}</p>
                                                                <div className="comment_actions">
                                                                    <button
                                                                        className="reply_button"
                                                                        onClick={() => handleReplyToggle(comment.comment_id)}
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                    {comment.user_id === userId && (
                                                                        <button
                                                                            className="delete_button"
                                                                            onClick={() => handleDeleteComment(comment.comment_id, post.post_id)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {activeCommentId === comment.comment_id && (
                                                                <div className="reply_section_hero">
                                                                    {comment.Replies && comment.Replies.length > 0 && (
                                                                        <div className="replies_section">
                                                                            {comment.Replies.map((reply) => (
                                                                                <div key={reply.reply_id} className="reply_item">
                                                                                    <div className="reply_header">
                                                                                        <img
                                                                                            src={`${baseURL}${reply.User?.profile_image_url || "/default-profile.png"}`}
                                                                                            alt="User"
                                                                                            className="reply_user_image"
                                                                                        />
                                                                                        <div className="reply_user_info">
                                                                                            <strong className="reply_user_name">{reply.User?.name || "Unknown"}</strong>
                                                                                            <br />
                                                                                            <span className="reply_date">
                                                                                                {new Date(reply.created_at).toLocaleDateString('en-US', {
                                                                                                    year: 'numeric',
                                                                                                    month: 'long',
                                                                                                    day: 'numeric'
                                                                                                })}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className="reply_text">{reply.reply}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <div className="reply_input_section">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Write a reply..."
                                                                            value={replyContent[comment.comment_id] || ""}
                                                                            onChange={(e) => handleReplyChange(comment.comment_id, e.target.value)}
                                                                            className="reply_input"
                                                                        />
                                                                        <button
                                                                            className="reply_submit_button"
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
                                                    className="comment_input"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post.post_id)}
                                                    className="comment_submit_button"
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

            {showDeleteModal && (
                <div className="delete_confirmation_modal">
                    <div className="modal_content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="modal_actions">
                            <button
                                className="modal_cancel_button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setPostToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal_delete_button"
                                onClick={confirmDeletePost}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostPage;