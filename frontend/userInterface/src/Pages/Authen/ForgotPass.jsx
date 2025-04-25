import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/ForgotPass.css";

function ForgotPass() {
    const [formData, setFormData] = useState({ forgotmail: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.forgotmail.trim() === "") {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/auth/forgot_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.forgotmail }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => {
                    navigate("/reset-code", { state: { email: formData.forgotmail } });
                }, 1500);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <ToastContainer />
            <div className="forgot-password__card">
                <h2 className="forgot-password__title">Forgot Password</h2>
                <p className="forgot-password__subtitle">
                    Enter your email and we’ll send you a 4-digit reset code.
                </p>
                <form onSubmit={handleSubmit} className="forgot-password__form">
                    <input
                        type="email"
                        name="forgotmail"
                        placeholder="Your Email Address"
                        value={formData.forgotmail}
                        onChange={handleInputChange}
                        className="forgot-password__input"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="forgot-password__button"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>
                <a href="/login" className="forgot-password__link">
                    Back to Login
                </a>
            </div>
        </div>
    );
}

export default ForgotPass;
