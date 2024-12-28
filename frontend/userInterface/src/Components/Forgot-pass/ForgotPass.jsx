import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './ForgotPass.css';

function ForgotPass() {

    const [formData, setFormData] = useState({
        forgotmail: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.forgotmail.trim() === "") {
            toast.error("Please provide your email.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/forgot_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.forgotmail
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setFormData({ email: "" });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="main">
            <ToastContainer />
            <div className="head">
                <h2>Forgot Your Password</h2>
                <p className="sub">Provide your email to reset your password</p>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <input type="email" name="forgotmail" id="frogotmail" placeholder="Enter your Registered Email" value={formData.forgotmail} onChange={handleInputChange} /> <br />
                    <button type="submit" className="submit">Request Reset Link</button>
                </form>
                <a href="/login">Back to login</a>
            </div>

        </div>
    );

};

export default ForgotPass;