import React, { useEffect } from "react";
import { useCartStore } from "../../Store/useCartStore";
import { useOrderStore } from "../../Store/useOrderStore";
import { useNavigate } from "react-router-dom";
import "../../Styles/CartPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function CartPage() {
    const {
        cartItems,
        totalPrice,
        cartloading,
        error,
        fetchCartItems,
        increaseCartItem,
        decreaseCartItem,
        removeCartItem,
        clearCart
    } = useCartStore();

    const { createOrder, isSubmittingOrder } = useOrderStore();
    const navigate = useNavigate();

    const IMAGE_URL = 'http://localhost:3000';

    useEffect(() => {
        const userID = localStorage.getItem("userID");
        if (userID) {
            fetchCartItems(userID);
        }
    }, [fetchCartItems]);

    const handleRemoveItem = (productId) => {
        const userID = localStorage.getItem("userID");
        removeCartItem(userID, productId);
        toast.success("Item removed from cart!");

    };

    const handleClearCart = () => {
        const userID = localStorage.getItem("userID");
        clearCart(userID);
        toast.success("whole cart is Cleared!");

    };

    const handleOrderNow = async () => {
        const userID = localStorage.getItem("userID");
        if (!userID) {
            console.error("User ID not found");
            return;
        }

        const response = await createOrder(userID, totalPrice);
        if (response.success) {
            console.log(response.message);
            navigate("/farmer/checkout");
        } else {
            console.error(response.message);
        }
    };

    return (
        <div className="cart-container">
            <div className="cartHeader">
                <ToastContainer />

                <div className="titleContainer">
                    <h2 className="cart-title">Shopping Cart</h2>
                </div>
                <button className="clear-cart-button" onClick={handleClearCart}>Clear Cart</button>
            </div>

            {cartloading ? (
                <p>Loading cart items...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
            ) : (
                <div className="cartList">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={`${IMAGE_URL}${item.Product?.imageUrl}`} alt={item.Product?.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <div className="cart_items_info">
                                        <h3>{item.Product?.name}</h3>
                                        <p>Price: RS. {item.price}</p>
                                        <p>Total: RS. {item.total}</p>
                                    </div>
                                    <div className="quantity-selector">
                                        <button onClick={() => decreaseCartItem(item.userId, item.productId)} disabled={item.quantity === 1}>-</button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button onClick={() => increaseCartItem(item.userId, item.productId)}>+</button>
                                    </div>
                                    <button className="remove-item" onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <h3>Total: RS. {totalPrice}</h3>
                    <button className="checkout-button" onClick={handleOrderNow} disabled={isSubmittingOrder}>
                        {isSubmittingOrder ? "Processing..." : "Order Now"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
