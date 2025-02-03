import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


function Dashboard() {
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    return (
        <div>
            <ToastContainer />
            <h1>Dashboard</h1>
        </div>
    );
}

export default Dashboard;
