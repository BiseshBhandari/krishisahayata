// import React, { useEffect, useState } from "react";
// import { useOrderStore } from "../../Store/useOrderStore";
// import "../../Styles/SellerOrderDetailPage.css";

// function SellerOrderDetailPage() {
//     const { fetchSellerOrders, sellerOrders, orderError } = useOrderStore();
//     const baseURL = 'http://localhost:3000';

//     const [filterStatus, setFilterStatus] = useState('All');
//     const [filteredOrders, setFilteredOrders] = useState(sellerOrders);

//     useEffect(() => {
//         const userId = localStorage.getItem("userID");
//         if (userId) {
//             fetchSellerOrders(userId);
//         }
//     }, [fetchSellerOrders]);

//     useEffect(() => {
//         if (filterStatus === 'All') {
//             setFilteredOrders(sellerOrders);
//         } else {
//             setFilteredOrders(
//                 sellerOrders.filter((order) => order.deliveryStatus === filterStatus)
//             );
//         }
//     }, [filterStatus, sellerOrders]);

//     console.log(filteredOrders);

//     return (
//         <div className="seller-orders-container">
//             <h1 className="seller-orders-title">Seller Orders</h1>

//             {orderError && <p className="error-message">{orderError}</p>}

//             {/* Filter Dropdown */}
//             <div className="filter-container">
//                 <label htmlFor="delivery-status">Filter by Delivery Status:</label>
//                 <select 
//                     id="delivery-status" 
//                     value={filterStatus} 
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                 >
//                     <option value="All">All</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Packed">Packed</option>
//                     <option value="Delivered">Delivered</option>
//                 </select>
//             </div>

//             {filteredOrders.length === 0 ? (
//                 <p className="no-orders">No orders have been placed yet.</p>
//             ) : (
//                 <div className="seller-orders-list">
//                     {filteredOrders.map((order) => (
//                         <div key={order.id} className="seller-order-card">
//                             <h2 className="order-id">Order ID: {order.id}</h2>
//                             <p className="user-name">Receiver's Name: {order.User.name}</p>
//                             <p className="user-email">Receiver's Email: {order.User.email}</p>

//                             <p className="order-status">Status: {order.orderStatus}</p>
//                             <p className="payment-status">Payment: {order.paymentStatus}</p>
//                             <p className="delivery-status">Delivery: {order.deliveryStatus}</p>

//                             <div className="order-items">
//                                 {order.OrderItems.map((item) => (
//                                     <div key={item.id} className="order-item">
//                                         <img 
//                                             src={`${baseURL}${item.Product.imageUrl}`} 
//                                             alt={item.Product.name} 
//                                             className="order-product-image" 
//                                         />
//                                         <div className="order-details">
//                                             <p className="product-name">{item.Product.name}</p>
//                                             <p>Quantity Ordered: {item.quantity}</p>
//                                             <p>Total Price: RS.{item.total}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <p className="order-date">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default SellerOrderDetailPage;

import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import "../../Styles/SellerOrderDetailPage.css";

function SellerOrderDetailPage() {
    const { fetchSellerOrders, sellerOrders, orderError } = useOrderStore();
    const baseURL = 'http://localhost:3000';

    const [filterStatus, setFilterStatus] = useState('All');
    const [filteredOrders, setFilteredOrders] = useState(sellerOrders);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortOrder, setSortOrder] = useState('All');

    useEffect(() => {
        const userId = localStorage.getItem("userID");
        if (userId) {
            fetchSellerOrders(userId);
        }
    }, [fetchSellerOrders]);

    useEffect(() => {
        // Apply filters based on status and date range
        let orders = sellerOrders;

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
    }, [filterStatus, sellerOrders, dateFrom, dateTo, sortOrder]);

    return (
        <div className="seller-orders-container">
            <div className="filter-sidebar">
                <h2 className="filter-title">Filters</h2>

                <div className="filter-section">
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

                <div className="filter-section">
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

                <div className="filter-section">
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

            <div className="seller-orders-content">

                {orderError && <p className="error-message">{orderError}</p>}

                {filteredOrders.length === 0 ? (
                    <p className="no-orders">No orders found based on the applied filters.</p>
                ) : (
                    <div className="seller-orders-list">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="seller-order-card">
                                <h2 className="order-id">Order ID: {order.id}</h2>
                                <p className="user-name">Receiver's Name: {order.User.name}</p>
                                <p className="user-email">Receiver's Email: {order.User.email}</p>

                                <p className="order-status">Status: {order.orderStatus}</p>
                                <p className="payment-status">Payment: {order.paymentStatus}</p>
                                <p className="delivery-status">Delivery: {order.deliveryStatus}</p>

                                <div className="order-items">
                                    {order.OrderItems.map((item) => (
                                        <div key={item.id} className="order-item">
                                            <img
                                                src={`${baseURL}${item.Product.imageUrl}`}
                                                alt={item.Product.name}
                                                className="order-product-image"
                                            />
                                            <div className="order-details">
                                                <p className="product-name">{item.Product.name}</p>
                                                <p>Quantity Ordered: {item.quantity}</p>
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
        </div>
    );
}

export default SellerOrderDetailPage;
