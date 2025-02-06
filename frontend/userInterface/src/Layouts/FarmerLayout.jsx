import React from "react";
import { Outlet } from "react-router-dom";

function FarmerLayout() {
    return (
        <div>
            <h1>Farmer Layout</h1>
            <Outlet />
        </div>
    );
}

export default FarmerLayout;