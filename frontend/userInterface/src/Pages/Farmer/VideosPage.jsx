// import React, { useEffect, useState } from "react";
// import { FaThumbsUp, FaComment, FaShareAlt, FaSearch } from "react-icons/fa"; // Importing icons
// import { useVideoStore } from "../../Store/useVideoStore"; // Importing the store
// import "../../Styles/videoPage.css";

// function VideosPage() {
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [searchQuery, setSearchQuery] = useState("");

//     const { allVideos, fetchAllVideos, loading, error } = useVideoStore();

//     useEffect(() => {
//         fetchAllVideos();
//     }, [fetchAllVideos]);

//     const filteredVideos = allVideos.filter((video) => {
//         const matchesCategory =
//             selectedCategory === "All" || video.category === selectedCategory;
//         const matchesSearch =
//             video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             video.description.toLowerCase().includes(searchQuery.toLowerCase());
//         return matchesCategory && matchesSearch;
//     });

//     return (
//         <div className="video-page">
//             <div className="main-content">
//                 <section className="video-section">
//                     <div className="video_header_section">
//                         <div className="search_bar">
//                             <input
//                                 type="text"
//                                 className="search-bar"
//                                 placeholder="Search videos..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                             <FaSearch className="search-icon" />
//                         </div>
//                         <div className="categories">
//                             <button
//                                 className={`category ${selectedCategory === "All" ? "active" : ""}`}
//                                 onClick={() => setSelectedCategory("All")}
//                             >
//                                 All
//                             </button>
//                             {Array.from(new Set(allVideos.map((video) => video.category))).map(
//                                 (category) => (
//                                     <button
//                                         key={category}
//                                         className={`category ${selectedCategory === category ? "active" : ""
//                                             }`}
//                                         onClick={() => setSelectedCategory(category)}
//                                     >
//                                         {category}
//                                     </button>
//                                 )
//                             )}
//                         </div>
//                     </div>

//                     {/* Display loading or error messages */}
//                     {loading && <p>Loading...</p>}
//                     {error && <p>{error}</p>}

//                     <div className="video-grid">
//                         {filteredVideos.map((video) => (
//                             <div key={video.tutorial_id} className="video-item">
//                                 <div className="video-image">
//                                     <video src={video.video_url} controls className="video-thumbnail"></video>
//                                 </div>
//                                 <div className="video_detials">
//                                     <p className="video-title">{video.title}</p>
//                                     <p className="video-description">{video.description}</p>
//                                     <button>{video.category}</button>
//                                 </div>
//                                 <div className="actions_buttons">
//                                     <button className="like_button">
//                                         <FaThumbsUp /> Like
//                                     </button>
//                                     <button className="comment_button">
//                                         <FaComment /> Comment
//                                     </button>
//                                     <button className="share_button">
//                                         <FaShareAlt /> Share
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

// export default VideosPage;
import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment, FaShareAlt, FaSearch } from "react-icons/fa";
import { useVideoStore } from "../../Store/useVideoStore";
import "../../Styles/videoPage.css";

function VideosPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { allVideos, fetchAllVideos, loading, error } = useVideoStore();

    useEffect(() => {
        fetchAllVideos();
    }, [fetchAllVideos]);

    const filteredVideos = allVideos.filter((video) => {
        const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              video.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="video-page">
            <div className="video-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>
                <div className="categories">
                    <button
                        className={`category ${selectedCategory === "All" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("All")}
                    >
                        All
                    </button>
                    {Array.from(new Set(allVideos.map((video) => video.category))).map((category) => (
                        <button
                            key={category}
                            className={`category ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display Loading or Error Messages */}
            {loading && <p className="loading-text">Loading videos...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="video-grid">
                {filteredVideos.map((video) => (
                    <div key={video.tutorial_id} className="video-card">
                        <video src={video.video_url} controls className="video-thumbnail"></video>
                        <div className="video-info">
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                            <button className="category-tag">{video.category}</button>
                        </div>
                        <div className="video-actions">
                            <button className="icon-button"><FaThumbsUp /> Like</button>
                            <button className="icon-button"><FaComment /> Comment</button>
                            <button className="icon-button"><FaShareAlt /> Share</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideosPage;
