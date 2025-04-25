import React from "react";

function ProductDetailModal({ product, quantity, setQuantity, onClose, onAddToCart, baseURL }) {
    if (!product) return null;

    return (
        <div className="product-modal-overlay">
            <div className="product-modal-content">
                <span className="product-close-modal" onClick={onClose}>&times;</span>
                <div className="product-details">
                    <div className="product-image-container">
                        <img
                            src={`${baseURL}${product.imageUrl}`}
                            alt={product.name}
                            className="product-modal-image"
                        />
                    </div>
                    <div className="product-details-info">
                        <h3 className="product-modal-name">{product.name}</h3>
                        <p className="product-modal-price">
                            RS. {product.discountPrice || product.price}
                        </p>
                        <p className="product-modal-description">{product.description}</p>
                        <p
                            className={`product-modal-stock-status ${product.stockStatus === "out-of-stock" ? "out" : "in"}`}
                        >
                            {product.stockStatus}
                        </p>

                        <div className="quantity-selector">
                            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                            <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                        </div>

                        <button onClick={onAddToCart} className="add-to-cart-btn">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;
