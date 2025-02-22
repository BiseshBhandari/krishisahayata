import React, { useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { usePostStore } from "../../Store/usePostStore";
import Loader from "../../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "../../Styles/AdminPost.css";

function AdminVerifyPost() {
    const { pendingPosts, fetchPendingPosts, approvePost, loading, error } = usePostStore();

    // Fetch pending posts on component mount
    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const handleVerification = async (post_id, verify_status) => {
        await approvePost(post_id, verify_status);

        fetchPendingPosts();
        toast.success(`Post ${verify_status === "approved" ? "approved" : "disapproved"} successfully`);

    };

    return (
        <div className="verify_Post_page">
            <ToastContainer />

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
                            <button className="approve_button" onClick={() => handleVerification(post.post_id, "approved")}>
                                <FaCheck /> Approve
                            </button>
                            <button className="reject_button" onClick={() => handleVerification(post.post_id, "disapproved")}>
                                <FaTimes /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminVerifyPost;
