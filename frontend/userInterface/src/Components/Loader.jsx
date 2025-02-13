import React from "react";
import "../Styles/Loader.css";

function Loader({ display_text }) {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-dots">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>
                <p className="loader-text">{display_text}</p>
            </div>
        </div>
    );
}

export default Loader;
