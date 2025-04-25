import React, { useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { usePostStore } from "../../Store/usePostStore";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader";
import "../../Styles/AdminPost.css";

function AdminVerifyPost() {
    const {
        pendingPosts,
        fetchPendingPosts,
        approvePost,
        loading,
        error
    } = usePostStore();

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const handleVerification = async (post_id, verify_status) => {
        await approvePost(post_id, verify_status);
        fetchPendingPosts();
        toast.success(`Post ${verify_status === "approved" ? "approved" : "disapproved"} successfully`);
    };

    return (
        <div className="verify_post_page">
            <ToastContainer />
            <h2 className="table_heading">Pending Post Approvals</h2>

            {loading && <p>Loading pending posts...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && pendingPosts.length === 0 && <p>No pending posts found.</p>}

            {!loading && !error && pendingPosts.length > 0 && (
                <div className="table_wrapper">
                    <table className="post_table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Content</th>
                                <th>User</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPosts.map((post) => (
                                <tr key={post.post_id}>
                                    <td>
                                        <img
                                            src={post.image_url}
                                            alt="Post"
                                            className="table_post_image"
                                        />
                                    </td>
                                    <td>{post.content.slice(0, 100)}...</td>
                                    <td>{post.User?.name || "Unknown"}</td>
                                    <td>
                                        <button
                                            className="approve_button"
                                            onClick={() =>
                                                handleVerification(post.post_id, "approved")
                                            }
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            className="reject_button"
                                            onClick={() =>
                                                handleVerification(post.post_id, "disapproved")
                                            }
                                        >
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminVerifyPost;
