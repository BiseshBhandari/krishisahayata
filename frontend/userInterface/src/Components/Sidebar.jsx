import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaVideo, FaFileAlt, FaBox, FaBars } from "react-icons/fa";
import "../Styles/Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const handleLogoutAdmin = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userID");
        localStorage.removeItem("userRole");

        navigate("/login");
    };

    return (
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                {isOpen && <h1 className="sidebar-title">krishi-Sahayata</h1>}
                <button onClick={() => setIsOpen(!isOpen)} className="menu-btn">
                    <FaBars size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <Link
                    to="/admin/dashboard"
                    className={`sidebar-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
                >
                    <FaTachometerAlt size={20} />
                    {isOpen && <span>Dashboard</span>}
                </Link>

                <Link
                    to="/admin/video"
                    className={`sidebar-link ${location.pathname === "/admin/video" ? "active" : ""}`}
                >
                    <FaVideo size={20} />
                    {isOpen && <span>Videos</span>}
                </Link>

                <Link
                    to="/admin/verify-post"
                    className={`sidebar-link ${location.pathname === "/admin/verify-post" ? "active" : ""}`}
                >
                    <FaFileAlt size={20} />
                    {isOpen && <span>Posts</span>}
                </Link>

                <Link
                    to="#"
                    className={`sidebar-link ${location.pathname === "/admin/items" ? "active" : ""}`}
                >
                    <FaBox size={20} />
                    {isOpen && <span>Items</span>}
                </Link>
            </nav>
            <div className="button_logout">
                <button className="logoutAdmin" onClick={handleLogoutAdmin}>Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;
