import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendDynamicRequest from "../../instance/apiUrl";
// import useVideoStore from "../../Store/useVideoStore";
import "../../Styles/AdminVideo.css";

function AdminVideo() {
    const [showModal, setShowModal] = useState(false);
    const [adminId, setAdminId] = useState(null);

    // const { videos, fetchVideos, loading, error } = useVideoStore((state) => ({
    //     videos: state.videos,
    //     fetchVideos: state.fetchVideos,
    //     loading: state.loading,
    //     error: state.error
    // }));

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        file: null
    });

    // Load adminId from localStorage
    useEffect(() => {
        const storedAdminId = localStorage.getItem("userID");
        if (storedAdminId) {
            setAdminId(storedAdminId);
        } else {
            toast.error("User not authenticated.");
        }
    }, []);

    // Fetch videos after adminId is set
    // useEffect(() => {
    //     if (adminId) {
    //         console.log("Fetching videos for adminId:", adminId);
    //         fetchVideos(adminId);
    //     }
    // }, [adminId]);

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

        try {
            const response = await sendDynamicRequest("post", `admin/upload_video/${adminId}`, videoData);
            console.log("Upload Response:", response);

            if (response && response.tutorial) {
                setFormData({ title: "", category: "", description: "", file: null });
                toast.success("Video uploaded successfully");
                // fetchVideos(adminId); // Refresh video list after upload
            } else {
                toast.error(response.message || "Video uploading failed");
            }
        } catch (error) {
            console.error("Failed to upload video:", error);
            toast.error("Error uploading video. Please try again.");
        }
    };

    return (
        <div className="admin-video">
            <div className="video_header">
                <h1 className="Video_Head">Admin Video :</h1>
                <button className="add_video_button" onClick={() => setShowModal(true)}>
                    Add Video
                </button>
            </div>
            <ToastContainer />

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

            {/* <div className="display_video">
                {loading ? (
                    <p>Loading videos...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : videos && videos.length > 0 ? (
                    videos.map((video) => (
                        <div key={video.tutorial_id} className="video_card">
                            <h3>{video.title}</h3>
                            <p>{video.category}</p>
                            <p>{video.description}</p>
                            <video width="300" controls>
                                <source src={video.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))
                ) : (
                    <p>No videos available</p>
                )}
            </div> */}
        </div>
    );
}

export default AdminVideo;
