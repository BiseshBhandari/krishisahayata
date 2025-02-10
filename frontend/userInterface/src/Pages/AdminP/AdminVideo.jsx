// import React from "react";
// import "../../Styles/AdminVideo.css"

// function AdminVideo() {
//     return (
//         <div className="admin-video">
//             <div className="video_header">
//                 <h1 className="Video_Head">Admin Video</h1>
//                 <button className="add_video_button">Add Video</button>
//             </div>
//             <div className="video_add_from">
//                 <form action="" className="video_form">

//                     <div className="fiels">
//                         <label htmlFor="video_title">Video Title</label>
//                         <input type="text" placeholder="Enter Video Title" className="video_title" />
//                     </div>

//                     <div className="fiels">
//                         <label className="video-category-label">Category:</label>
//                         <select name="category" className="video-category-input" required>
//                             <option value="">Select Category</option>
//                             <option value="Tutorial">Education</option>
//                             <option value="Informational">Entertainment</option>
//                             <option value="Technological">Technology</option>
//                             <option value="Guides">Others</option>
//                         </select>
//                     </div>

//                     <div className="fiels">
//                         <label htmlFor="video_description">Video Description</label>
//                         <input type="text" placeholder="Enter Video URL" className="video_description" />
//                     </div>

//                     <div className="fiels">
//                         <label htmlFor="video_file">Video URL</label>
//                         <input type="file" accept="video/*" name="video_file" className="video_file" />
//                     </div>

//                     <div className="Video_submitButton">
//                         <button className="add_video">Add Video</button>
//                     </div>
//                 </form>
//             </div>
//             <div className="display_video">

//             </div>


//         </div>
//     );
// }

// export default AdminVideo;

import React, { useState } from "react";
import "../../Styles/AdminVideo.css";

function AdminVideo() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="admin-video">
            <div className="video_header">
                <h1 className="Video_Head">Admin Video</h1>
                <button className="add_video_button" onClick={() => setShowModal(true)}>Add Video</button>
            </div>

            {/* Video Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
                        <form className="video_form">
                            <div className="fiels">
                                <label className="video-title-label">Video Title</label>
                                <input type="text" placeholder="Enter Video Title" className="video-title-input" />
                            </div>

                            <div className="fiels">
                                <label className="video-category-label">Category:</label>
                                <select name="category" className="video-category-input" required>
                                    <option value="">Select Category</option>
                                    <option value="Tutorial">Education</option>
                                    <option value="Informational">Entertainment</option>
                                    <option value="Technological">Technology</option>
                                    <option value="Guides">Others</option>
                                </select>
                            </div>

                            <div className="fiels">
                                <label className="video-description-label">Video Description</label>
                                <input type="text" placeholder="Enter Video Description" className="video-description-input" />
                            </div>

                            <div className="fiels">
                                <label className="video-file-label">Upload Video</label>
                                <input type="file" accept="video/*" className="video-file-input" />
                            </div>

                            <div className="Video_submitButton">
                                <button className="add_video">Add Video</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="display_video"></div>
        </div>
    );
}

export default AdminVideo;
