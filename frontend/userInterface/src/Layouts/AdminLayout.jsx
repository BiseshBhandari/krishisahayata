import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "../Styles/AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Sidebar className="admin-sidebar" />
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
