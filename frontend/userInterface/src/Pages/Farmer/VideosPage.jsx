import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment, FaShareAlt, FaSearch } from "react-icons/fa";
import { useVideoStore } from "../../Store/useVideoStore";
import "../../Styles/videoPage.css";

function VideosPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVideo, setModalVideo] = useState(null); // Modal state
    const { allVideos, fetchAllVideos, loading, error } = useVideoStore();

    useEffect(() => {
        fetchAllVideos();
    }, [fetchAllVideos]);

    const filteredVideos = allVideos.filter((video) => {
        const matchesCategory =
            selectedCategory === "All" || video.category === selectedCategory;
        const matchesSearch =
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    {Array.from(new Set(allVideos.map((video) => video.category))).map(
                        (category) => (
                            <button
                                key={category}
                                className={`category ${selectedCategory === category ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        )
                    )}
                </div>
            </div>

            {loading && <p className="loading-text">Loading videos...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="video-grid">
                {filteredVideos.map((video) => (
                    <div
                        key={video.tutorial_id}
                        className="video-card"
                        onClick={() => setModalVideo(video)}
                    >
                        <video
                            src={video.video_url}
                            className="video-thumbnail"
                            muted
                            preload="metadata"
                        />
                        <div className="video-info">
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                            <button className="category-tag">{video.category}</button>
                        </div>

                    </div>
                ))}
            </div>

            {modalVideo && (
                <div className="modal-overlay" onClick={() => setModalVideo(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <video
                            src={modalVideo.video_url}
                            controls
                            autoPlay
                            className="modal-video"
                        />
                        <button className="modal-close" onClick={() => setModalVideo(null)}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideosPage;
