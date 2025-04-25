import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../Store/useCartStore";
import "../Styles/Navbar.css";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

import Applogo from "../assets/Images/app-log.png";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("jwtToken");

    const { cartCount } = useCartStore();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showMarketDropdown, setShowMarketDropdown] = useState(false);

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

                <div className="navbar-dropdown">
                    <button className="dropdown-toggle navbar-link" onClick={() => setShowMarketDropdown(!showMarketDropdown)}>
                        Market
                    </button>
                    {showMarketDropdown && (
                        <div className="dropdown-menu market-dropdown">
                            <Link to="/farmer/market" onClick={() => setShowMarketDropdown(false)}>Market</Link>
                            <Link to="/farmer/my-products" onClick={() => setShowMarketDropdown(false)}>My Products</Link>
                            <Link to="/farmer/orders-for-me" onClick={() => setShowMarketDropdown(false)}>Orders For Me</Link>
                            <Link to="/farmer/orders-by-me" onClick={() => setShowMarketDropdown(false)}>Orders By Me</Link>
                        </div>
                    )}
                </div>

                <Link to="/farmer/crop-guide" className={`navbar-link ${location.pathname === "/farmer/crop-guide" ? "active" : ""}`}>Crop-Guide</Link>
            </div>
            <div className="navbar-button">
                <FaShoppingCart className="cart-icon" onClick={() => navigate("/farmer/cart")} />
                {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}

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
                                <button onClick={() => navigate("/farmer/profile")}>Profile</button>
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
