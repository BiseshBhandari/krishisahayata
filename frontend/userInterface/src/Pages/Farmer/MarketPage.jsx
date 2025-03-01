import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useProductStore } from "../../Store/useProductStoe";
import Loader from "../../Components/Loader";
import "../../Styles/MarketPage.css"

function MarketPage() {
    const [showModal, setShowModal] = useState(false);

    const [user_id, setUser_id] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);


    const [] = useState(null);

    const { addProduct, fetchAllProducts, products, loading, error } = useProductStore();

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [selectedStock, setSelectedStock_status] = useState("All");

    const [searchQuery, setSearchQuery] = useState("");

    const baseURL = 'http://localhost:3000';

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        discountPrice: "",
        category: "",
        stockQuantity: "",
        file: null
    });

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    useEffect(() => {
        const stored_id = localStorage.getItem("userID");
        if (stored_id) {
            setUser_id(stored_id);
        }
        fetchAllProducts();
    }, [fetchAllProducts]);


    const filteredProducts = products.filter((product) => {

        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchStock =
            selectedStock === "All" || product.stockStatus === selectedStock;
        return matchesCategory && matchesSearch && matchStock;
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setFormData({ ...formData, file: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user_id) {
            return toast.error("Please log in again.");
        }

        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("price", formData.price);
        productData.append("description", formData.description);
        productData.append("discountPrice", formData.discountPrice);
        productData.append("category", formData.category);
        productData.append("stockQuantity", formData.stockQuantity);
        productData.append("image", formData.file);

        try {
            await addProduct(productData, user_id);
            toast.success("Product added Successfully");
            setFormData({
                name: "",
                price: "",
                description: "",
                discountPrice: "",
                category: "",
                stockQuantity: "",
                file: null
            });
            fetchAllProducts();
            setShowModal(false);
        } catch (err) {
            console.error("Error adding product:", err);
            toast.error(error || "Failed to add Product");
        }
    };

    return (
        <div className="MarketContainer">
            <ToastContainer />
            {loading && <Loader display_text="Adding..." />}
            <div className="MarketFilters">
                <div className="product_Categories">
                    <div className="prodict_categories_title">
                        <p>Categories:</p>
                    </div>
                    <div className="categories_filter">
                        <button
                            className={`category ${selectedCategory === "All" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("All")}
                        >
                            All
                        </button>
                        {Array.from(new Set(products.map((product) => product.category))).map(
                            (category) => (
                                <button
                                    key={category}
                                    className={`category ${selectedCategory === category ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="Product_stock">
                    <div className="product_stock_title">
                        <p>Stock filter:</p>
                    </div>
                    <div className="stock_filter">

                        <button
                            className={`category ${selectedCategory === "All" ? "active" : ""}`}
                            onClick={() => setSelectedStock_status("All")}
                        >
                            All
                        </button>
                        {Array.from(new Set(products.map((product) => product.stockStatus))).map(
                            (stockStatus) => (
                                <button
                                    key={stockStatus}
                                    className={`category ${selectedStock === stockStatus ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedStock_status(stockStatus)}
                                >
                                    {stockStatus}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="ProuctDisplay">
                <div className="ProductDisplay_head">
                    <div className="search_bar_container">
                        <input type="search" className="product_search_bar" placeholder="Search here....." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="add_product_btn_container">
                        <button className="add_product_btn" onClick={() => setShowModal(true)}> Add Product</button>
                    </div>
                </div>

                <div className="ProductDisplay_body">
                    <div className="product-card-list">
                        {filteredProducts?.length ? (
                            filteredProducts.map((product) => (
                                <div key={product.product_id} className="product-card" onClick={() => handleSelectProduct(product)}>
                                    <div className="product_image_con">
                                        <img src={`${baseURL}${product.imageUrl}`} alt={product.name} className="product-image" />
                                    </div>
                                    <div className="product-info">
                                        <div className="name_price">
                                            <h3 className="product-name">{product.name}</h3>
                                            <div className="product-price-section">
                                                <span className="product-price">
                                                    RS. {product.discountPrice || product.price}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`stock-status ${product.stockStatus === "out-of-stock" ? "out" : "in"}`}>
                                            {product.stockStatus}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-products">No products available</p>
                        )}
                    </div>

                </div>
            </div>

            {showModal && (
                <div className="product-modal-overlay">
                    <div className="product-modal-content">
                        <span className="product-close-modal" onClick={() => setShowModal(false)}>&times;</span>
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="product_fileds_row">
                                <div className="product-fields">
                                    <label className="product-label">Product Name</label>
                                    <input type="text" name="name" placeholder="Enter Product Name" className="product-input" onChange={handleChange} required />
                                </div>

                                <div className="product-fields">
                                    <label className="product-label">Price</label>
                                    <input type="number" name="price" placeholder="Enter Price" className="product-input" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="product_fileds_row">
                                <div className="product-fields">
                                    <label className="product-label">Category</label>
                                    <select name="category" className="product-input" onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Home">Home</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <div className="product-fields">
                                    <label className="product-label">Discount Price</label>
                                    <input type="number" name="discountPrice" placeholder="Enter Discount Price" className="product-input" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="product_fileds_row">
                                <div className="product-fields">
                                    <label className="product-label">Upload Image</label>
                                    <input type="file" name="file" accept="image/*" className="product-input" onChange={handleChange} required />
                                </div>

                                <div className="product-fields">
                                    <label className="product-label">Stock Quantity</label>
                                    <input type="number" name="stockQuantity" placeholder="Enter Stock Quantity" className="product-input" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="product-fields">
                                <label className="product-label">Description</label>
                                <textarea name="description" placeholder="Enter Description" className="product-input" onChange={handleChange}></textarea>
                            </div>

                            <div className="product-submit-button">
                                <button className="product-add-button" type="submit">Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* {selectedProduct && (
                <div className="product-modal-overlay">
                    <div className="product-modal-content">
                        <span className="product-close-modal" onClick={() => setSelectedProduct(null)}>&times;</span>
                        <div className="product-details">
                            <div className="product-image-container">
                                <img src={`${baseURL}${selectedProduct.imageUrl}`} alt={selectedProduct.name} className="product-modal-image" />
                            </div>
                            <div className="product-details-info">
                                <h3 className="product-modal-name">{selectedProduct.name}</h3>
                                <p className="product-modal-price">RS. {selectedProduct.discountPrice || selectedProduct.price}</p>
                                <p className="product-modal-description">{selectedProduct.description}</p>
                                <p className={`product-modal-stock-status ${selectedProduct.stockStatus === "out-of-stock" ? "out" : "in"}`}>
                                    {selectedProduct.stockStatus}
                                </p>
                                <button className="add-to-cart-button" onClick={() => addToCart(selectedProduct)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {selectedProduct && (
                <div className="product-modal-overlay">
                    <div className="product-modal-content">
                        <span className="product-close-modal" onClick={() => setSelectedProduct(null)}>&times;</span>
                        <div className="product-details">
                            <div className="product-image-container">
                                <img src={`${baseURL}${selectedProduct.imageUrl}`} alt={selectedProduct.name} className="product-modal-image" />
                            </div>
                            <div className="product-details-info">
                                <h3 className="product-modal-name">{selectedProduct.name}</h3>
                                <p className="product-modal-price">RS. {selectedProduct.discountPrice || selectedProduct.price}</p>
                                <p className="product-modal-description">{selectedProduct.description}</p>
                                <p className={`product-modal-stock-status ${selectedProduct.stockStatus === "out-of-stock" ? "out" : "in"}`}>
                                    {selectedProduct.stockStatus}
                                </p>

                                {/* Quantity Selector */}
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                                </div>

                                <button className="add-to-cart-button" onClick={() => console.log("Add to Cart", selectedProduct, quantity)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPage;