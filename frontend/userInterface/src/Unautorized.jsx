import React from "react";
import "../src/Styles/Unauthorized.css";

function Unauthorized() {
    return (
        <div className="un_body">
            <div className="unavailable_container">
                <h1 className="un_head">Unauthorized</h1>
                <p className="un_sub">You do not have permission to access this page.</p>
            </div>
        </div>
    );
}

export default Unauthorized;
