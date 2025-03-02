import React, { useEffect } from "react";
import { useCartStore } from "../../Store/useCartStore";
import "../../Styles/CartPage.css";

function CartPage() {
    const { cartItems, totalPrice, cartloading, error, fetchCartItems } = useCartStore();

    useEffect(() => {
        const userID = localStorage.getItem("userID");
        if (userID) {
            fetchCartItems(userID);
        }
    }, [fetchCartItems]);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Shopping Cart</h2>

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
                                <img src={item.Product?.imageUrl} alt={item.Product?.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{item.Product?.name}</h3>
                                    <p>Price: RS. {item.price}</p>
                                    <p>Total: RS. {item.total}</p>
                                    <div className="quantity-selector">
                                        <button>-</button>
                                        <input type="number" value={item.quantity} readOnly />
                                        <button>+</button>
                                    </div>
                                    <button className="remove-item">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <h3>Total: RS. {totalPrice}</h3>
                    <button className="checkout-button">Order now</button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
