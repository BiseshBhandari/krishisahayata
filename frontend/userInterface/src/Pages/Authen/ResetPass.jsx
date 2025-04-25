

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import '../../Styles/ResetPass.css';

function ResetPass() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resetCode: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [timer, setTimer] = useState(300); // 5-minute timer

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { resetCode, newPassword, confirmPassword } = formData;

        if (!resetCode || !newPassword || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/auth/reset_pass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reset_code: resetCode, new_password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate("/login"), 3000);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="reset-container">
            <ToastContainer />
            <div className="reset-header">
                <h1>Reset Password</h1>
                <p>Enter the reset code sent to your email and choose a new password.</p>
                <small>Reset code expires in: <b>{formatTime()}</b></small>
            </div>
            <div className="reset-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="resetCode"
                        placeholder="Reset Code"
                        value={formData.resetCode}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit" className="reset-btn">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPass;


