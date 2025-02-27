import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useProductStore } from "../../Store/useProductStoe";
import Loader from "../../Components/Loader";
import "../../Styles/MarketPage.css"


function MarketPage() {
    const [showModal, setShowModal] = useState(false);
    const [user_id, setUser_id] = useState(null);

    const { addProduct, loading, error } = useProductStore();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        discountPrice: "",
        category: "",
        stockQuantity: "",
        file: null
    });

    useEffect(() => {
        const stored_id = localStorage.getItem("userID");
        if (stored_id) {
            setUser_id(stored_id);
        }
    }, []);

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
        </div>
    );
};

export default MarketPage;