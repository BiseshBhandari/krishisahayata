import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import registerimage from '../../assets/Images/login-register-image.png';

import '../../Styles/RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        UserName: "",
        email: "",
        password: "",
        confirm_pass: "",
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

        if (formData.password !== formData.confirm_pass) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.UserName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setFormData({ UserName: "", email: "", password: "", confirm_pass: "" });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="register_container">
            <ToastContainer />
            <div className="image">
                <img src={registerimage} alt="" />
            </div>
            <div className="Register-from">
                <div className="head">
                    <h2>Getting Started</h2>
                    <p className="register-sub">Create an account to explore</p>
                </div>
                <div className="from">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="UserName" id="UserName" placeholder="UserName" value={formData.UserName} onChange={handleInputChange} /> <br />
                        <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                        <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                        <input type="password" name="confirm_pass" id="confirm_pass" placeholder="Confirm Password" value={formData.confirm_pass} onChange={handleInputChange} /> <br />
                        <button className="register" type="submit">Sign Up</button>
                        <div className="foote">
                            <p>Already have an account <a href="/login">SIGN UP</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;