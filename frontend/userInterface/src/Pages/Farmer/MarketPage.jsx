import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

import "../../Styles/MarketPage.css"


function MarketPage() {
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setFormData({ ...formData, file: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className="MarketContainer">
            <div className="MarketFilters">
                <p>filteres</p>
            </div>
            <div className="ProuctDisplay">
                <div className="ProductDisplay_head">
                    <div className="search_bar_container">
                        <input type="search" className="product_search_bar" placeholder="Search here....." name="" id="" />
                    </div>
                    <div className="add_product_btn_container">
                        <button className="add_product_btn" onClick={() => setShowModal(true)}> Add Product</button>
                    </div>
                </div>

                <div className="ProductDisplay_body">
                    <div className="product_card">
                        <div className="product_image">
                            <img src="" alt="" />
                        </div>
                        <div className="product_details">
                            <div className="product_name">
                                <p>Product Name</p>
                                <div className="actions">
                                    <button className="edit_btn">
                                        <FaEdit /> Edit
                                    </button>
                                    <button className="prod_delete_btn">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                            <div className="product_category">
                                <p>Product Category</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="product-modal-overlay">
                    <div className="product-modal-content">
                        <span className="product-close-modal" onClick={() => setShowModal(false)}>&times;</span>
                        <form className="product-form">

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
                                    <input type="file" name="imageUrl" accept="image/*" className="product-input" onChange={handleChange} required />
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
        </div>
    );
};

export default MarketPage;