import React from "react";
import '../Styles/product.css'

function ProductCard({ productss }) {
    return (
        <div className="product-card">
            {productss ? (
                productss.map((product) => (
                    <div key={product.product_id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-category">{product.category}</p>
                            <p className="product-description">{product.description}</p>
                            <div className="product-price-section">
                                <span className="product-price">${product.price}</span>
                                {product.discountPrice && (
                                    <span className="discount-price">${product.discountPrice}</span>
                                )}
                            </div>
                            <p className={`stock-status ${product.stockStatus === "out-of-stock" ? "out" : "in"}`}>
                                {product.stockStatus}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default ProductCard;
