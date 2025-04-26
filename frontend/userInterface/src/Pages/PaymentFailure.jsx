import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import "../Styles/PaymentSuccess.css";


function PaymentFailure() {

    return (
        <div className="payment-container">
            <div className="check-icon">
                <IoCloseCircle size={80} color="red" />
            </div>
            <h1 className="payment-header">Payment Failed</h1>
            <p className="payment-subtext">Unfortunately, your payment could not be completed.</p>
            <a href="/" className="home-button">Back to Home</a>
        </div>
    );
}

export default PaymentFailure;
