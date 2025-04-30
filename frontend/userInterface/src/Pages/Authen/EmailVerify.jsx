import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import '../../Styles/VerifyEmailPage.css';

function VerifyEmailPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = location.state || {};

    const handleInputChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim() || verificationCode.length !== 4 || !/^\d{4}$/.test(verificationCode)) {
            toast.error("Please enter a valid 4-digit code!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/verify_email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    verification_code: verificationCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Email verified successfully!");
                setVerificationCode("");
                navigate('/login');
            } else {
                toast.error(data.message || "Verification failed.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="verify-email-container">
            <ToastContainer />
            <div className="verify-email-card">
                <h1 className="verify-email-title">Verify Your Email</h1>
                <p className="verify-email-subtitle">
                    We sent a 4-digit code to <strong>{email}</strong>. Enter it below to verify your account.
                </p>
                <form onSubmit={handleSubmit} className="verify-email-form">
                    <label htmlFor="verificationCode" className="verify-email-label">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        placeholder="Enter 4-digit code"
                        value={verificationCode}
                        onChange={handleInputChange}
                        maxLength="4"
                        className="verify-email-input"
                        aria-describedby="code-help"
                    />
                    <p id="code-help" className="verify-email-help">
                        The code is valid for 15 minutes.
                    </p>
                    <button type="submit" className="verify-email-button">
                        Verify Email
                    </button>
                </form>
                <div className="verify-email-footer">
                    <p>
                        Didn't receive the code? <a href="/register" className="verify-email-link">Resend</a>
                    </p>
                    <p>
                        Back to <a href="/login" className="verify-email-link">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;