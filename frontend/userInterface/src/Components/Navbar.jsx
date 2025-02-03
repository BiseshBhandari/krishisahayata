import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

function Navbar() {
    return (
        <div className="navbar">
            <div className="logo">
                <img src="" alt="" />
            </div>
            <div className="nav-links">
                <Link to="#">Home</Link>
                <Link to="">Videos</Link>
                <Link to="">Posts</Link>
                <Link to="">Market</Link>
            </div>
            <div className="button">
                <button>Get Started </button>
            </div>
        </div>
    );
}

export default Navbar;