import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import sendDynamicRequest from "../instance/apiUrl";
import "../Styles/PaymentSuccess.css";

const IMAGE_URL = 'http://localhost:3000';

function PaymentSuccess() {
    const { order_id: paramOrderId } = useParams();
    const [searchParams] = useSearchParams();
    const queryOrderId = searchParams.get("order_id");
    const dataquery = searchParams.get("data");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null);

    const orderId = paramOrderId || queryOrderId;

    useEffect(() => {
        if (!dataquery) {
            setError("No payment data found.");
            return;
        }

        try {
            const decodedData = atob(dataquery);
            const parsedData = JSON.parse(decodedData);
            console.log("Decoded payment data:", parsedData);
            setData(parsedData);

            verifyPayment(parsedData);

        } catch (error) {
            console.error("Error decoding payment data:", error);
            setError("Invalid payment data received.");
        }
    }, [dataquery]);

    const verifyPayment = async (paymentData) => {
        try {
            const response = sendDynamicRequest('post', `/farmer/verifyPayment/${orderId}`, {
                transaction_uuid: paymentData.transaction_uuid,
                total_amount: paymentData.total_amount,
                product_code: paymentData.product_code,
                transaction_code: paymentData.transaction_code,
                status: paymentData.status,
                signature: paymentData.signature
            });

            if (response.success) {
                setPaymentStatus("Payment verified and order updated.");
            } else {
                setPaymentStatus("Payment verification failed.");
            }
        } catch (err) {
            console.error("Error verifying payment:", err);
            setPaymentStatus("Error verifying payment.");
            console.log("Sending payment data to backend:", {
                transaction_uuid: paymentData.transaction_uuid,
                total_amount: paymentData.total_amount,
                product_code: paymentData.product_code,
                transaction_code: paymentData.transaction_code,
                status: paymentData.status,
                signature: paymentData.signature
            });
        }
    };

    return (
        <div className="payment-container">
            <div className="check-icon">
                <IoCheckmarkCircle size={80} color="#27AE60" />
            </div>
            <h1 className="payment-header">Payment Successful</h1>
            <p className="payment-subtext">Your payment has been processed securely.</p>

            {error ? (
                <p className="error-message">{error}</p>
            ) : data ? (
                <div className="payment-details">
                    <p><strong>Order ID:</strong> {orderId || "N/A"}</p>
                    <p><strong>Transaction ID:</strong> {data.transaction_uuid}</p>
                    <p><strong>Amount Paid:</strong> Rs. {data.total_amount}</p>
                </div>
            ) : (
                <p className="loading-text">Loading payment details...</p>
            )}

            {paymentStatus && (
                <p className="payment-status-message">{paymentStatus}</p>
            )}

            <a href="/" className="home-button">Back to Home</a>
        </div>
    );
}

export default PaymentSuccess;