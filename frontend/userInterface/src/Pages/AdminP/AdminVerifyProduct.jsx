import React, { useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useProductStore } from "../../Store/useProductStoe";
import { ToastContainer, toast } from "react-toastify";
import "../../Styles/AdminProduct.css";

function AdminVerifyProduct() {
    const {
        pendingProducts,
        fetchPendingProducts,
        approveProduct,
        rejectProduct,
        loading,
        error
    } = useProductStore();

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const IMAGE_URL = 'http://localhost:3000';

    const handleVerification = async (productId, verifyStatus) => {
        if (verifyStatus === "approved") {
            await approveProduct(productId);
            toast.success("Product approved successfully");
        } else {
            await rejectProduct(productId);
            toast.error("Product rejected successfully");
        }
        fetchPendingProducts();
    };

    return (
        <div className="verify_product_page">
            <ToastContainer />
            <h2 className="table_heading">Pending Product Approvals</h2>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && (
                <div className="table_wrapper">
                    <table className="product_table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>User</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="9">No pending products found.</td>
                                </tr>
                            ) : (
                                pendingProducts.map((product) => (
                                    <tr key={product.product_id}>
                                        <td>
                                            <img
                                                src={`${IMAGE_URL}${product.imageUrl}`}
                                                alt={product.name}
                                                className="table_product_image"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>Rs. {product.price}</td>
                                        <td>
                                            {product.discountPrice > 0
                                                ? `Rs. ${product.discountPrice}`
                                                : "No Discount"}
                                        </td>
                                        <td>
                                            {product.stockStatus} ({product.stockQuantity})
                                        </td>
                                        <td>{product.category}</td>
                                        <td>{product.User?.name || "Unknown"}</td>
                                        <td>{product.description.slice(0, 50)}...</td>
                                        <td>
                                            <button
                                                className="approve_button"
                                                onClick={() =>
                                                    handleVerification(product.product_id, "approved")
                                                }
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="reject_button"
                                                onClick={() =>
                                                    handleVerification(product.product_id, "disapproved")
                                                }
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminVerifyProduct;
