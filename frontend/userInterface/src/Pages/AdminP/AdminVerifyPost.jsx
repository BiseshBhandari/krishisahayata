import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { usePostStore } from '../../Store/usePostStore';
import "./../../Styles/AdminPost.css";

function AdminVerifyPost() {
    const { pendingPosts, fetchPendingPosts, loading, error } = usePostStore();

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    return (
        <div className="VerifyPost_container">
            {loading && <p>Loading pending posts...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && pendingPosts.length === 0 && <p>No pending posts found.</p>}

            {pendingPosts.map((post) => (
                <div key={post.post_id} className="Pending_post_list">
                    <div className="Pending_post_list_image">
                        <img src={post.image_url} alt="Post preview" />
                    </div>
                    <div className="Pending_post_list_user">
                        <div className="Pending_post_list_user_image">
                            <img src="" alt="User profile" />
                        </div>
                        <h2>{post.User?.name || "Unknown User"}</h2>
                    </div>
                    <div className="Pending_post_list_content">
                        <p>{post.content}</p>
                    </div>
                    <div className="Pending_post_list_actions">
                        <button className="approve_button">
                            <FaCheck /> Approve
                        </button>
                        <button className="reject_button">
                            <FaTimes /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminVerifyPost;
