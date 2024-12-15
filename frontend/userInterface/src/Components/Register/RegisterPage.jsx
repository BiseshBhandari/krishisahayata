import React from "react";

function RegisterPage() {
    return (
        <>
            <div className="Main">
                <div className="login_form">
                    <div className="text">
                        <h2>Getting Started</h2>
                        <p>Create an account to explore</p>
                    </div>
                    <div className="from">
                        <form>
                            <input type="text" placeholder="UserName" name="UserName" id="UserName" />
                            <input type="email" name="email" id="email" placeholder="Email" />

                            <div className="password">
                                <input type="password" name="password" id="password" placeholder="Password" />
                                <input type="password" name="confirm_pass" id="confirm_pass" placeholder="Confirm Password" />
                            </div>
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                </div>
                <div className="image">
                    <img src="" alt="" />
                </div>
            </div>

        </>
    )
}

export default RegisterPage