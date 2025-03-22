import React, { useEffect } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import "../../Styles/CustomerOrderPage.css";

function CustomerOrderPage() {
    const { fetchCustomerOrders, customerOrders, orderError } = useOrderStore();
    const baseURL = 'http://localhost:3000';

    useEffect(() => {
        const userId = localStorage.getItem("userID");
        if (userId) {
            fetchCustomerOrders(userId);
        }
    }, []);

    console.log(customerOrders);

    return (
        <div className="customer-orders-container">
            <h1 className="orders-title">My Orders</h1>

            {orderError && <p className="error-message">{orderError}</p>}

            {customerOrders.length === 0 ? (
                <p className="no-orders">You have not placed any orders yet.</p>
            ) : (
                <div className="orders-list">
                    {customerOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h2 className="order-id">Order ID: {order.id}</h2>
                            <p className="order-status">Status: {order.orderStatus}</p>
                            <p className="payment-status">Payment: {order.paymentStatus}</p>
                            <div className="order-items">
                                {order.OrderItems.map((item) => ( 
                                    <div key={item.id} className="order-item">
                                        <img src={`${baseURL}${item.Product.imageUrl}`} alt={item.Product.name} className="customer-order-product-image" />
                                        <div className="order-details">
                                            <p className="product-name">{item.Product.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total Price: RS.{item.total}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="order-date">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomerOrderPage;
