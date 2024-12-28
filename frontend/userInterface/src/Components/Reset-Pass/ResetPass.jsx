import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import './ResetPass.css';

function ResetPass() {

    const { token } = useParams();

    const [formData, setFormData] = useState({
        resetpassword: "",
        confirmPassword: ""

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

        if (formData.resetpassword !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/auth/reset_pass/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_password: formData.resetpassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setFormData({ resetpassword: "", confirmPassword: "" });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };
    return (
        <div className="main_div">
            <ToastContainer />
            <div className="head">
                <h1>Reset Account Password</h1>
                <p>Provide a new password for your account</p>
            </div>
            <div className="resetForm">
                <form onSubmit={handleSubmit}>
                    <input type="password" name="resetpassword" id="resetpassword" placeholder="Password" value={formData.resetpassword} onChange={handleInputChange} />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} /> <br />
                    <button type="submit" className="reset">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;

