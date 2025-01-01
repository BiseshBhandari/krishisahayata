import React from "react";
import './AdminDash.css';
import Sidebar from "../Sidebar/Sidebar";

function AdminDash() {
    return (

        <div className="admin_dash">
            <Sidebar />
            <div className="Dash_component">
                <div className="fist-row">
                    <div className="tutorial">
                        

                    </div>
                    <div className="user">

                    </div>

                    <div className="post">

                    </div>
                </div>

            </div>
        </div>
    )
};

export default AdminDash;