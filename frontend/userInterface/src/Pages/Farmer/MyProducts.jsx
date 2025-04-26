import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useProductStore } from "../../Store/useProductStoe";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../Styles/MyProducts.css";

function MyProducts() {
    const [userId, setUserId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        stockQuantity: "",
        stockStatus: "",
        image: null,
    });

    const { userProducts, loading, error, fetchUserProducts, updateProduct, deleteProduct } = useProductStore();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userID");
        if (storedUserId) {
            setUserId(storedUserId);
            fetchUserProducts(storedUserId);
        } else {
            toast.error("User not authenticated.");
        }
    }, [fetchUserProducts]);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            discountPrice: product.discountPrice || "",
            category: product.category || "",
            stockQuantity: product.stockQuantity || "",
            stockStatus: product.stockStatus || "",
            image: null,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setEditFormData({ ...editFormData, image: e.target.files[0] });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("User ID is missing.");
            return;
        }

        const formData = new FormData();
        formData.append("name", editFormData.name);
        formData.append("description", editFormData.description);
        formData.append("price", editFormData.price);
        formData.append("discountPrice", editFormData.discountPrice);
        formData.append("category", editFormData.category);
        formData.append("stockQuantity", editFormData.stockQuantity);
        formData.append("stockStatus", editFormData.stockStatus);
        if (editFormData.image) {
            formData.append("image", editFormData.image);
        }

        try {
            await updateProduct(selectedProduct.product_id, formData);
            toast.success("Product updated successfully");
            setShowEditModal(false);
            fetchUserProducts(userId);
        } catch (err) {
            toast.error("Failed to update product");
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProduct(selectedProduct.product_id);
            toast.success("Product deleted successfully");
            setShowDeleteConfirm(false);
            fetchUserProducts(userId);
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const filteredProducts = userProducts.filter((product) =>
        filterStatus === "All" ? true : product.approvalStatus.toLowerCase() === filterStatus.toLowerCase()
    );

    return (
        <div className="my_info">
            <div className="my_info-header">
                <h1 className="my_info-head">My Products</h1>
                <div className="my_info-filter">
                    <label className="my_filter-label">Filter by Status:</label>
                    <select
                        className="my_filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Approved">Approved</option>
                        <option value="Disapproved">Disapproved</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>
            <ToastContainer />

            {loading && <p className="my_loading-text">Loading...</p>}
            {error && <p className="my_error-text">{error}</p>}
            {filteredProducts.length === 0 && !loading && (
                <p className="my_empty-text">No products available.</p>
            )}

            {filteredProducts.length > 0 && (
                <div className="my_info-table-container">
                    <table className="my_info-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Stock Status</th>
                                <th>Approval Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product.product_id}
                                    className="my_info-row"
                                    onClick={() => handleRowClick(product)}
                                >
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        ${parseFloat(product.price).toFixed(2)}
                                        {product.discountPrice > 0 && (
                                            <span className="my_discount-price">
                                                (Discount: ${parseFloat(product.discountPrice).toFixed(2)})
                                            </span>
                                        )}
                                    </td>
                                    <td>{product.stockQuantity}</td>
                                    <td>{product.stockStatus}</td>
                                    <td>{product.approvalStatus}</td>
                                    <td>
                                        <button
                                            className="my_edit-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(product);
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="my_delete-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(product);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showEditModal && (
                <div className="my_modal-overlay">
                    <div className="my_modal-content">
                        <span className="my_close-modal" onClick={() => setShowEditModal(false)}>
                            ×
                        </span>
                        <h3 className="my_modal-title">Edit Product</h3>
                        <form className="my_info-form" onSubmit={handleEditSubmit}>
                            <div className="my_form-row">
                                <div className="my_form-field">
                                    <label className="my_form-label">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="my_form-input"
                                        value={editFormData.name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="my_form-field">
                                    <label className="my_form-label">Category</label>
                                    <select
                                        name="category"
                                        className="my_form-select"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Machinery">Machinery</option>
                                        <option value="Crops">Crops</option>
                                        <option value="Livestock">Livestock</option>
                                        <option value="Tools">Tools</option>
                                    </select>
                                </div>
                            </div>
                            <div className="my_form-row">
                                <div className="my_form-field">
                                    <label className="my_form-label">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="my_form-input"
                                        value={editFormData.price}
                                        onChange={handleEditChange}
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="my_form-field">
                                    <label className="my_form-label">Discount Price ($)</label>
                                    <input
                                        type="number"
                                        name="discountPrice"
                                        className="my_form-input"
                                        value={editFormData.discountPrice}
                                        onChange={handleEditChange}
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="my_form-row">
                                <div className="my_form-field">
                                    <label className="my_form-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        className="my_form-input"
                                        value={editFormData.stockQuantity}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="my_form-field">
                                    <label className="my_form-label">Stock Status</label>
                                    <select
                                        name="stockStatus"
                                        className="my_form-select"
                                        value={editFormData.stockStatus}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="in-Stock">In Stock</option>
                                        <option value="out-of-Stock">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                            <div className="my_form-row">
                                <div className="my_form-field">
                                    <label className="my_form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="my_form-textarea"
                                        value={editFormData.description}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <div className="my_form-field">
                                    <label className="my_form-label">Product Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        className="my_form-file"
                                        accept="image/*"
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>
                            <div className="my_form-submit">
                                <button className="my_submit-button" type="submit">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailsModal && selectedProduct && (
                <div className="my_modal-overlay">
                    <div className="my_modal-content">
                        <span className="my_close-modal" onClick={() => setShowDetailsModal(false)}>
                            ×
                        </span>
                        <h3 className="my_modal-title">{selectedProduct.name}</h3>
                        <div className="my_info-details">
                            {selectedProduct.imageUrl && (
                                <img
                                    src={`http://localhost:3000${selectedProduct.imageUrl}`}
                                    alt={selectedProduct.name}
                                    className="my_info-image"
                                />
                            )}
                            <div className="my_details-grid">
                                <div className="my_detail-item">
                                    <strong>Product ID:</strong> {selectedProduct.product_id}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Price:</strong> ${parseFloat(selectedProduct.price).toFixed(2)}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Discount Price:</strong> $
                                    {selectedProduct.discountPrice > 0
                                        ? parseFloat(selectedProduct.discountPrice).toFixed(2)
                                        : "N/A"}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Category:</strong> {selectedProduct.category}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Stock Quantity:</strong> {selectedProduct.stockQuantity}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Stock Status:</strong> {selectedProduct.stockStatus}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Approval Status:</strong> {selectedProduct.approvalStatus}
                                </div>
                                <div className="my_detail-item">
                                    <strong>Created At:</strong>{" "}
                                    {new Date(selectedProduct.created_at).toLocaleString()}
                                </div>
                                <div className="my_detail-item my_detail-description">
                                    <strong>Description:</strong> {selectedProduct.description || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="my_modal-overlay">
                    <div className="my_modal-content">
                        <h3 className="my_modal-title">Confirm Delete</h3>
                        <p className="my_confirm-text">
                            Are you sure you want to delete "{selectedProduct?.name}"?
                        </p>
                        <div className="my_confirm-buttons">
                            <button
                                className="my_confirm-button my_cancel"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button className="my_confirm-button my_delete" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyProducts;