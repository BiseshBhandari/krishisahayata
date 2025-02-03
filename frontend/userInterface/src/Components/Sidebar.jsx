import React, { useState } from "react";
import '../Styles/Sidebar.css';

function Sidebar() {

    return (
        <aside>
            <div className="side-pannel">
                <div className="side-head">
                    <h1>krishi-Sahayata </h1>
                </div>
                <div className="nav-tags">
                    <a href="/admin_dash" className="nav-Item active" >Dashboard</a>
                    <a href="/admin_video" className="nav-Item" >Vidoes</a>
                    <a href="#" className="nav-Item" >Posts</a>
                    <a href="#" className="nav-Item" >Items</a>
                </div>
            </div>
        </aside>

    )
};

export default Sidebar;