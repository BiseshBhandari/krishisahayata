import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import sendDynamicRequest from "../../instance/apiUrl";
import loginImage from '../../assets/Images/login-register-image.png';
import '../../Styles/LoginPage.css';

function LoginPage() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

        try {

            const data = await sendDynamicRequest("post", "auth/login", formData);
            // const response = await fetch("http://localhost:3000/auth/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(formData),
            // });


            if (data.token) {
                const { token } = data;

                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userRole = decodedToken.role;

                localStorage.setItem("jwtToken", token);
                localStorage.setItem("userRole", userRole);

                if (userRole === "admin") {
                    toast.success("Login successful!");
                    window.location.href = "/admin/dashboard";

                } else if (userRole === "farmer") {

                    toast.success("Login successful!");
                    window.location.href = "/dashboard";
                }

            } else {
                toast.error(data.message || "Invalid login credentials.");
            }
        } catch (err) {
            toast.error(data.message);
            console.log(err.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                <input type="text" name="email" id="emails" placeholder="Enter your Email" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="Password">
                                <input type="password" name="password" id="pass" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                            </div>
                            <p className="forgot"><a href="/forgot-pass">Forgot password ?</a></p>
                            <button className="login" type="submit">Sign in</button>
                        </form>
                        <div className="foot">
                            <p>Don't Have an account? <a href="/register">Create</a></p>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )

}

export default LoginPage;