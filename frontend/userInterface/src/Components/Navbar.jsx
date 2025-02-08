import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";
import Applogo from "../assets/Images/app-log.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={Applogo} alt="Logo" />
            </div>
            <div className="navbar-links">
                <Link to="#" className="navbar-link">Home</Link>
                <Link to="#" className="navbar-link">Videos</Link>
                <Link to="#" className="navbar-link">Posts</Link>
                <Link to="#" className="navbar-link">Market</Link>
                <Link to="#" className="navbar-link">Crop-Guide</Link>

            </div>
            <div className="navbar-button">
                <button className="btn-get-started">Get Started</button>
            </div>
        </nav>
    );
}

export default Navbar;
