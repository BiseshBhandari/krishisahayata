import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendDynamicRequest from "../../instance/apiUrl";
import { useVideoStore } from "../../Store/useVideoStore";
import Loader from "../../Components/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/AdminVideo.css";

function AdminVideo() {
    const [showModal, setShowModal] = useState(false);
    const [adminId, setAdminId] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState(false);


    const fetchVideos = useVideoStore((state) => state.fetchVideos);
    const { videos, loading, error } = useVideoStore();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        file: null
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
    }, [adminId]);

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
                setUploading(false);
                fetchVideos(adminId);
            } else {
                toast.error(response.message || "Video uploading failed");
            }
        } catch (error) {
            console.error("Failed to upload video:", error);
            toast.error("Error uploading video. Please try again.");
        } finally {
        }
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

    return (
        <div className="admin-video">
            <div className="video_header">
                <h1 className="Video_Head">Uploaded Videos</h1>
                <button className="add_video_button" onClick={() => setShowModal(true)}>
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
                        <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
                        <form className="video_form" onSubmit={handleSubmit}>
                            <div className="fields">
                                <label className="video-title-label">Video Title</label>
                                <input type="text" name="title" placeholder="Enter Video Title" className="titleField" onChange={handleChange} required />
                            </div>

                            <div className="fields">
                                <label className="video-description-label">Video Description</label>
                                <input type="text" name="description" placeholder="Enter Video Description" onChange={handleChange} required />
                            </div>

                            <div className="fields">
                                <label className="video-category-label">Category:</label>
                                <select name="category" onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    <option value="Education">Education</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div className="fields">
                                <label className="video-file-label">Upload Video</label>
                                <input type="file" name="file" accept="video/*" onChange={handleChange} required />
                            </div>

                            <div className="Video_submitButton">
                                <button className="add_video" type="submit">Add Video</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="video_list">
                {loading && <p>Loading videos...</p>}
                {error && <p className="error">{error}</p>}
                {videos.length === 0 && !loading && <p>No videos available.</p>}
                {videos.map((video, index) => (
                    <div key={index} className="video_item">
                        <div className="actual_video">
                            <video controls crossOrigin="anonymous">
                                <source src={video.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className="video_info">
                            <div className="video_info_head">
                                <h3>{video.title}</h3>
                                <button className="delete_btn" onClick={() => handleDelete(video.tutorial_id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <p>{video.description}</p>
                            <p>{video.category}</p>
                            <div className="video_actions">

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminVideo;