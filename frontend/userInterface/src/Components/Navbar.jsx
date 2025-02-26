import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Navbar.css";
import { FaUserCircle } from "react-icons/fa";

import Applogo from "../assets/Images/app-log.png";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("jwtToken");

    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userID");
        localStorage.removeItem("userRole");

        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={Applogo} alt="Logo" />
            </div>
            <div className="navbar-links">
                <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
                <Link to="/farmer/videos" className={`navbar-link ${location.pathname === "/farmer/videos" ? "active" : ""}`}>Videos</Link>
                <Link to="/farmer/post" className={`navbar-link ${location.pathname === "/farmer/post" ? "active" : ""}`}>Posts</Link>
                <Link to="/farmer/market" className={`navbar-link ${location.pathname === "/farmer/market" ? "active" : ""}`}>Market</Link>
                <Link to="#" className={`navbar-link ${location.pathname === "/farmer/crop" ? "active" : ""}`}>Crop-Guide</Link>

            </div>
            <div className="navbar-button">
                {!isLoggedIn ? (
                    <button className="btn-get-started" onClick={() => navigate("/register")}>Get Started</button>
                ) : (
                    <div
                        className="profile-menu"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <FaUserCircle className="profile-icon" />
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate("#")}>Profile</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}


export default Navbar;
