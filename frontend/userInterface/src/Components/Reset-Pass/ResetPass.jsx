import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './ResetPass.css';

function ResetPass() {
    return (
        <div className="main">
            <div className="head">
                <h1>Reset Account Password</h1>
                <p>Provide a new password for your account</p>
            </div>
            <div className="resetForm">
                <form action="">
                    <input type="password" name="resetpassword" id="resetpassword" placeholder="Password" />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" /> <br />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;

