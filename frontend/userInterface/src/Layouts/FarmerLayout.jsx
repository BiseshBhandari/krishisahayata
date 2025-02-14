import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
function FarmerLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default FarmerLayout;