import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import sendDynamicRequest from "../../instance/apiUrl";
import Applogo from "../../assets/Images/login.png";

import "../../Styles/LoginPage.css";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await sendDynamicRequest("post", "auth/login", formData);

            if (response && response.token) {
                const { token, user, message } = response;
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken.role;
                const userID = decodedToken.Id;

                localStorage.setItem("jwtToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userRole", userRole);
                localStorage.setItem("userID", userID);

                toast.success(message || "Login successful!");

                // Redirect based on user role
                if (userRole === "admin") {
                    window.location.href = "/admin/dashboard";
                } else if (userRole === "farmer") {
                    window.location.href = "/";
                } else {
                    window.location.href = "/";
                }
            } else {
                toast.error("Unexpected response from server.");
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Login failed. Please try again.";
            toast.error(errMsg);
            console.error("Login error:", error);
        }
    };

    return (
        <>
            <div className="log-container">
                <ToastContainer />
                <div className="login-image">
                    <img src={Applogo} alt="Logo" />
                </div>

                <div className="login_form">
                    <div className="login-head">
                        <h2>Welcome Back</h2>
                        <p>Log In to Continue Growing with Us!</p>
                    </div>
                    <div className="form_container">
                        <form onSubmit={handleSubmit}>
                            <div className="userName">
                                <input
                                    type="text"
                                    name="email"
                                    id="emails"
                                    placeholder="Enter your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="login_Password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="pass"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="show_pass"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <p className="forgot">
                                <a href="/forgot-pass">Forgot password ?</a>
                            </p>

                            <button className="login" type="submit">
                                Sign in
                            </button>
                        </form>

                        <div className="foot">
                            <p>
                                Don't Have an account? <a href="/register">Create</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
