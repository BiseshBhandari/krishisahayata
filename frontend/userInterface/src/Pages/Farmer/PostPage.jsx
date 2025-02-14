import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "../../Styles/PostPage.css";


function PostPage() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    return (
        <div className="post_page">
            <div className="post_container_1"></div>

            <div className="post_container_2">
                <div className="postform">
                    <div className="postFormHeader">
                        <h1 className="post_form_header_h1">Create Post</h1>
                    </div>
                    <div className="PostformContainer">
                        <div className="userProfile_photo">
                            <img className="profile_image" src="" alt="" />
                        </div>
                        <div className="PostformFileds">
                            <form>
                                <textarea name="post" id="post" placeholder="Write a post" className="Post_content"></textarea>
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
                                        <input type="file" id="file" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <button type="submit">Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="allPosts"></div>
            </div>

            <div className="post_container_3"></div>
        </div>
    );
}

export default PostPage;