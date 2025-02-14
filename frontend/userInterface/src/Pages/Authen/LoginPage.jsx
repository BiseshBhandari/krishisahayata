import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendDynamicRequest from "../../instance/apiUrl";
import loginImage from "../../assets/Images/login-register-image.png";
import "../../Styles/LoginPage.css";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await sendDynamicRequest("post", "auth/login", formData);

            if (data.token) {
                const { token, user } = data;
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken.role;
                const userID = decodedToken.Id;

                localStorage.setItem("jwtToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userRole", userRole);
                localStorage.setItem("userID", userID);

                toast.success("Login successful!");

                if (userRole === "admin") {
                    window.location.href = "/admin/dashboard";
                } else if (userRole === "farmer") {
                    window.location.href = "/";
                }
            } else {
                toast.error("Invalid login credentials.");
            }
        } catch (err) {
            toast.error("Login failed!");
            console.error(err);
        }
    };

    return (
        <>
            <div className="log-container">
                <ToastContainer />
                <div className="login-image">
                    <img src={loginImage} alt="login image" />
                </div>

                <div className="login_form">
                    <div className="login-head">
                        <h2>Welcome Back</h2>
                        <p>Provide your login details to continue</p>
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
                            <div className="Password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="pass"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button type="button" className="show_pass" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
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
