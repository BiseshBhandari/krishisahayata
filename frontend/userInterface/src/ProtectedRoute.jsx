import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;