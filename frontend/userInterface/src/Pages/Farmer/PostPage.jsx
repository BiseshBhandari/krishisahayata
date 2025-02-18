import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { usePostStore } from "../../Store/usePostStore";
import "../../Styles/PostPage.css";


function PostPage() {
    const [formData, setFormData] = useState({ content: "", file: null });
    const [selectedImage, setSelectedImage] = useState(null);
    const { addPost, loading, error } = usePostStore();
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const storedUserId = localStorage.getItem("userID");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setFormData({ ...formData, file: e.target.files[0] });
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
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
        } catch (err) {
            toast.error("Failed to add post");
        }
    };

    return (
        <div className="post_page">
            <div className="post_container_1">

                <div className="postform">
                    <div className="postFormHeader">
                        <h1 className="post_form_header_h1">Create Post</h1>
                    </div>
                    <div className="PostformContainer">
                        <div className="userProfile_photo">
                            <img className="profile_image" src="" alt="" />
                        </div>
                        <div className="PostformFileds">
                            <form onSubmit={handleSubmit}>
                                <textarea name="content" id="post" placeholder="Write a post" className="Post_content" value={formData.content} onChange={handleChange}></textarea>
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
                                        <input type="file" id="file" accept="image/*" onChange={handleChange} />
                                    </label>
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

            <div className="post_container_2">
                <div className="allPosts"></div>
            </div>

            <div className="post_container_3"></div>
        </div>
    );
}

export default PostPage; 