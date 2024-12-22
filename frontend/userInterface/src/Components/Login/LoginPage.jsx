import React from "react";
import './LoginPage.css';

function LoginPage() {
    return (
        <>
            <div className="log-container">
                <div className="login-image">

                </div>

                <div className="login_form">
                    <div className="login-head">
                        <h2>Welcome Back</h2>
                        <p>Provide your login details to continue</p>
                    </div>
                    <div className="form_container">
                        <form action="">
                            <div className="userName">
                                <input type="text" name="email" id="emails" placeholder="Enter your Email" />
                            </div>
                            <div className="password">
                                <input type="password" name="password" id="pass" placeholder="Password" />
                            </div>
                            <p className="forgot"><a href="">Forgot password ?</a></p>
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