import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../../Styles/Dashboard.css";


function Dashboard() {
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    return (
        <div className="dashboard_section">
            <ToastContainer />
            <h1 className="Dash_heading">Dashboard</h1>
        </div>
    );
}

export default Dashboard;
