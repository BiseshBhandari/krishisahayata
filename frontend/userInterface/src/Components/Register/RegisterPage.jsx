import React from "react";
import './RegisterPage.css'

function RegisterPage() {
    return (
        <div className="container">
            <div className="image">
                <img src="" alt="" />
            </div>
            <div className="login_form">
                <div className="head">
                    <h2>Getting Started</h2>
                    <p className="sub">Create an account to explore</p>
                </div>
                <div className="from">
                    <form>
                        <input type="text" name="UserName" id="UserName" placeholder="UserName" /> <br />
                        <input type="email" name="email" id="email" placeholder="Email" />

                        <div className="pass">
                            <input type="password" name="password" id="password" placeholder="Password" />
                            <input type="password" name="confirm_pass" id="confirm_pass" placeholder="Confirm Password" />
                        </div>
                        {/* <div className="text">
                            <div className="box">
                                <input type="checkbox" name="remember" id="remeber" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <p>Forgot password?</p>
                        </div> */}
                        <button className="register" type="submit">Sign Up</button>
                        <div className="footer">
                            <p>Already have an account <a href="/login">SIGN UP</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage