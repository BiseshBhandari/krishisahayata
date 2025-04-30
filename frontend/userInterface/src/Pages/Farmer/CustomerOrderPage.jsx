import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import "../../Styles/CustomerOrderPage.css";

function CustomerOrderPage() {
    const { fetchCustomerOrders, customerOrders, orderError } = useOrderStore();
    const baseURL = 'http://localhost:3000';

    const [filterStatus, setFilterStatus] = useState('All');
    const [filteredOrders, setFilteredOrders] = useState(customerOrders);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortOrder, setSortOrder] = useState('descending');

    useEffect(() => {
        const userId = localStorage.getItem("userID");
        if (userId) {
            fetchCustomerOrders(userId);
        }
    }, [fetchCustomerOrders]);

    useEffect(() => {
        let orders = [...customerOrders];

        if (filterStatus !== 'All') {
            orders = orders.filter((order) => order.deliveryStatus === filterStatus);
        }

        if (dateFrom) {
            orders = orders.filter((order) => new Date(order.createdAt) >= new Date(dateFrom));
        }

        if (dateTo) {
            orders = orders.filter((order) => new Date(order.createdAt) <= new Date(dateTo));
        }

        if (sortOrder === 'ascending') {
            orders = orders.sort((a, b) => a.id - b.id);
        } else {
            orders = orders.sort((a, b) => b.id - a.id);
        }

        setFilteredOrders(orders);
    }, [filterStatus, customerOrders, dateFrom, dateTo, sortOrder]);

    return (
        <div className="customer-orders-container">
            <div className="customer_mini_container">
                <div className="customer-filter-sidebar">
                    <h2 className="customer-filter-title">Filters</h2>

                    <div className="customer-filter-section">
                        <label htmlFor="delivery-status">Filter by Delivery Status:</label>
                        <select
                            id="delivery-status"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Packed">Packed</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    <div className="customer-filter-section">
                        <label htmlFor="date-from">From Date:</label>
                        <input
                            type="date"
                            id="date-from"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                        <label htmlFor="date-to">To Date:</label>
                        <input
                            type="date"
                            id="date-to"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>

                    <div className="customer-filter-section">
                        <label htmlFor="sort-order">Sort by Order ID:</label>
                        <select
                            id="sort-order"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                </div>

                <div className="customer-orders-content">
                    <h1 className="customer-orders-title">My Orders</h1>


                    {filteredOrders.length === 0 ? (
                        <p className="customer-no-orders">No orders found based on the applied filters.</p>
                    ) : (
                        <div className="customer-orders-list">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="customer-order-card">
                                    <h2 className="customer-order-id">Order ID: {order.id}</h2>

                                    <p className="customer-order-status">
                                        Status: <span className={`customer - status - badge ${order.orderStatus === "Pending" ? "status-pending" : "status-confirmed"
                                            } `}>{order.orderStatus}</span>
                                    </p>

                                    <p className="customer-payment-status">
                                        Payment: <span className={`customer - status - badge ${order.paymentStatus === "Paid" ? "status-paid" :
                                            order.paymentStatus === "Failed" ? "status-failed" : "status-pending"
                                            } `}>{order.paymentStatus}</span>
                                    </p>

                                    <p className="customer-deliver-status">
                                        Order is: <span className={`customer - status - badge ${order.deliveryStatus === "Pending" ? "status-pending" :
                                            order.deliveryStatus === "Packed" ? "status-packed" : "status-delivered"
                                            } `}>{order.deliveryStatus}</span>
                                    </p>

                                    <div className="customer-order-items">
                                        {order.OrderItems.map((item) => (
                                            <div key={item.id} className="customer-order-item">
                                                <img
                                                    src={`${baseURL}${item.Product.imageUrl} `}
                                                    alt={item.Product.name}
                                                    className="customer-order-product-image"
                                                />
                                                <div className="customer-order-details">
                                                    <p className="customer-product-name">{item.Product.name}</p>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Total Price: RS.{item.total}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="customer-order-date">
                                        Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerOrderPage;