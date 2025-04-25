import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import registerimage from '../../assets/Images/register-image.png';
import '../../Styles/RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        UserName: "",
        email: "",
        password: "",
        confirm_pass: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { UserName, email, password, confirm_pass } = formData;

        if (!UserName.trim() || !email.trim() || !password.trim() || !confirm_pass.trim()) {
            toast.error("All fields are required!");
            return;
        }

        if (password !== confirm_pass) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must be at least 8 characters, include an uppercase, lowercase, a number, and a special character!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: UserName.trim(),
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Registration successful!");
                setFormData({ UserName: "", email: "", password: "", confirm_pass: "" });
            } else {
                toast.error(data.message || "Registration failed.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="register_container">
            <ToastContainer />
            <div className="image_section">
                <div className="image">
                    <img src={registerimage} alt="Farm App" />
                </div>
                <p className="app_description">
                    Grow with Us – Register Today and Cultivate a Sustainable Future!
                </p>
            </div>
            <div className="Register-from">
                <div className="head">
                    <h2>Getting Started</h2>
                    <p className="register-sub">Create an account to explore</p>
                </div>
                <div className="from">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="UserName"
                            id="UserName"
                            placeholder="User Name"
                            value={formData.UserName}
                            onChange={handleInputChange}
                        /> <br />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="register_show_pass"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="password-input">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_pass"
                                id="confirm_pass"
                                placeholder="Confirm Password"
                                value={formData.confirm_pass}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="register_show_pass"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <br />
                        <button className="register" type="submit">Sign Up</button>
                        <div className="foote">
                            <p>Already have an account? <a href="/login">LOGIN</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
