import React, { useEffect } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import "../../Styles/CheckOutPage.css";

function CheckOutPage() {
    const { orders, esewaPayload, esewaUrl, getOrders } = useOrderStore();

    useEffect(() => {
        const userId = localStorage.getItem("userID");
        if (userId) {
            getOrders(userId);
        }
    }, [getOrders]);

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1 className="page-title">Check Out</h1>

                {orders.length > 0 ? (
                    <>
                        <div className="order-summary">
                            <h2 className="summary-title">Order Summary</h2>
                            <div className="order-details">
                                <p><strong>Total Amount:</strong> {orders[0].totalAmount}</p>
                            </div>
                        </div>

                        {/* Show the form directly without button */}
                        {esewaPayload && esewaUrl && (
                            <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className="payment-form">
                                <input type="hidden" name="amount" value={esewaPayload.amount} required />
                                <input type="hidden" name="tax_amount" value={esewaPayload.tax_amount} required />
                                <input type="hidden" name="total_amount" value={esewaPayload.total_amount} required />
                                <input type="hidden" name="transaction_uuid" value={esewaPayload.transaction_uuid} required />
                                <input type="hidden" name="product_code" value={esewaPayload.product_code} required />
                                <input type="hidden" name="product_service_charge" value={esewaPayload.product_service_charge} required />
                                <input type="hidden" name="product_delivery_charge" value={esewaPayload.product_delivery_charge} required />
                                <input type="hidden" name="success_url" value={esewaPayload.success_url} required />
                                <input type="hidden" name="failure_url" value={esewaPayload.failure_url} required />
                                <input type="hidden" name="signed_field_names" value={esewaPayload.signed_field_names} required />
                                <input type="hidden" name="signature" value={esewaPayload.signature} required />
                                <input type="submit" value="Submit Payment" className="payment-submit-button" />
                            </form>
                        )}
                    </>
                ) : (
                    <p>Loading orders...</p>
                )}
            </div>
        </div>
    );
}

export default CheckOutPage;
