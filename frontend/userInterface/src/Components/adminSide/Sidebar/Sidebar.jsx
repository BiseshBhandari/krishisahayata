import React, { useState } from "react";
import './Sidebar.css';

function Sidebar() {

    return (
        <div className="side-pannel">
            <div className="side-head">
                <h1>krishi-Sahayata </h1>
            </div>
            <div className="nav-tags">
                <a href="" className="nav-Item active" >Dashboard</a>
                <a href="" className="nav-Item" >Vidoes</a>
                <a href="" className="nav-Item" >Posts</a>
                <a href="" className="nav-Item" >Items</a>
            </div>
        </div>
    )

};

export default Sidebar;