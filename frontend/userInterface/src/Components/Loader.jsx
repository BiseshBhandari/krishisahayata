import React from "react";
import "../Styles/Loader.css"; // Ensure you have styles for the loader

function Loader() {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loader;