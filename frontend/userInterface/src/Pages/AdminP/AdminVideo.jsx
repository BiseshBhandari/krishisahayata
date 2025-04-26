import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendDynamicRequest from "../../instance/apiUrl";
import { useVideoStore } from "../../Store/useVideoStore";
import Loader from "../../Components/Loader";
import { FaTrash } from "react-icons/fa";
import "../../Styles/AdminVideo.css";

function AdminVideo() {
    const [showModal, setShowModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [adminId, setAdminId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchVideos = useVideoStore((state) => state.fetchVideos);
    const { videos, loading, error } = useVideoStore();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        file: null,
    });

    useEffect(() => {
        const storedAdminId = localStorage.getItem("userID");
        if (storedAdminId) {
            setAdminId(storedAdminId);
        } else {
            toast.error("User not authenticated.");
        }
    }, []);

    useEffect(() => {
        if (adminId) {
            console.log("Fetching videos for adminId:", adminId);
            fetchVideos(adminId);
        }
    }, [adminId, fetchVideos]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setFormData({ ...formData, file: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.file) {
            toast.error("Please select a video file.");
            return;
        }

        if (!adminId) {
            toast.error("Admin ID is missing. Please log in again.");
            return;
        }

        const videoData = new FormData();
        videoData.append("title", formData.title);
        videoData.append("description", formData.description);
        videoData.append("category", formData.category);
        videoData.append("video", formData.file);

        setUploading(true);

        try {
            const response = await sendDynamicRequest("post", `admin/upload_video/${adminId}`, videoData);
            console.log("Upload Response:", response);

            if (response && response.tutorial) {
                setFormData({ title: "", category: "", description: "", file: null });
                toast.success("Video uploaded successfully");
                setShowModal(false);
                fetchVideos(adminId);
            } else {
                toast.error(response.message || "Video uploading failed");
            }
        } catch (error) {
            console.error("Failed to upload video:", error);
            toast.error("Error uploading video. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (video) => {
        setSelectedVideo(video);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async (tutorial_id) => {
        if (!adminId) {
            toast.error("Admin ID is missing. Please log in again.");
            return;
        }
        setDeleting(true);

        try {
            const response = await sendDynamicRequest("delete", `admin/deleteVideo/${tutorial_id}`);

            if (response.message === "Video deleted successfully") {
                toast.success("Video deleted successfully");
                fetchVideos(adminId);
            } else {
                toast.error(response.message || "Failed to delete video");
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error("Error deleting video. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const confirmDelete = async () => {
        await handleDelete(selectedVideo.tutorial_id);
        setShowDeleteConfirm(false);
        setSelectedVideo(null);
    };

    const handleRowClick = (video) => {
        setSelectedVideo(video);
        setShowVideoModal(true);
    };

    return (
        <div className="admin-video">
            <div className="admin-video-header">
                <h1 className="video-head">Uploaded Videos</h1>
                <button className="add-video-button" onClick={() => setShowModal(true)}>
                    Add Video
                </button>
            </div>
            <ToastContainer />

            {loading && <Loader display_text="Loading..." />}
            {uploading && <Loader display_text="Uploading..." />}
            {deleting && <Loader display_text="Deleting..." />}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setShowModal(false)}>×</span>
                        <form className="video-form" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label className="form-label">Video Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter Video Title"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Video Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter Video Description"
                                    className="form-input"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label">Category</label>
                                <select
                                    name="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Animal">Animal</option>
                                    <option value="Birds">Birds</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Plants">Plants</option>
                                    <option value="Guides">Guides</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Upload Video</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept="video/*"
                                    className="form-file"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-submit">
                                <button className="submit-button" type="submit">Add Video</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showVideoModal && selectedVideo && (
                <div className="modal-overlay">
                    <div className="video-modal-content">
                        <span className="close-modal" onClick={() => setShowVideoModal(false)}>×</span>
                        <h3 className="video-modal-title">{selectedVideo.title}</h3>
                        <video controls className="video-player" crossOrigin="anonymous">
                            <source src={selectedVideo.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}

            {showDeleteConfirm && selectedVideo && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Confirm Delete</h3>
                        <p className="confirm-text">
                            Are you sure you want to delete "{selectedVideo.title}"?
                        </p>
                        <div className="confirm-buttons">
                            <button
                                className="confirm-button cancel"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-button delete"
                                onClick={confirmDelete}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="video-table-container">
                {loading && <p className="loading-text">Loading videos...</p>}
                {error && <p className="error-text">{error}</p>}
                {videos.length === 0 && !loading && <p className="empty-text">No videos available.</p>}
                {videos.length > 0 && (
                    <table className="video-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video.tutorial_id} className="video-row" onClick={() => handleRowClick(video)}>
                                    <td>{video.title}</td>
                                    <td>{video.description?.substring(0, 50) + (video.description?.length > 50 ? "..." : "")}</td>
                                    <td>{video.category}</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(video);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminVideo;