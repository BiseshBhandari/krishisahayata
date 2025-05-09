import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useProductStore = create((set, get) => ({
    products: [],
    userProducts: [],
    pendingProducts: [],
    loading: false,
    error: null,

    // Add new product
    addProduct: async (productData, user_ID) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("post", `farmer/addProduct/${user_ID}`, productData);

            if (response?.product) {
                set((state) => ({
                    products: [response.product, ...state.products],
                    userProducts: response.product.user_id === user_ID
                        ? [response.product, ...state.userProducts]
                        : state.userProducts,
                    loading: false,
                    error: null
                }));
            } else {
                throw new Error("Failed to add the product");
            }
        } catch (err) {
            set({
                loading: false,
                error: err?.message || "There was an issue in adding product"
            });
        }
    },

    // Fetch all products
    fetchAllProducts: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/products`);
            set({
                products: response.products || [],
                loading: false,
                error: response.products ? null : "No products found",
            });
        } catch (err) {
            set({
                products: [],
                loading: false,
                error: err.message,
            });
        }
    },

    // Fetch products created by a specific user
    fetchUserProducts: async (user_ID) => {
        if (!user_ID || get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/userProduct/${user_ID}`);
            set({
                userProducts: response.products || [],
                loading: false,
                error: response.products ? null : "No products found",
            });
        } catch (err) {
            set({
                userProducts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    deleteProduct: async (productId) => {
        if (!productId) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("delete", `farmer/deleteProduct/${productId}`);

            if (response?.success) {
                set((state) => ({
                    products: state.products.filter(product => product.id !== productId),
                    userProducts: state.userProducts.filter(product => product.id !== productId),
                    pendingProducts: state.pendingProducts.filter(product => product.id !== productId),
                    loading: false,
                    error: null
                }));
            } else {
                throw new Error("Failed to delete product");
            }
        } catch (err) {
            set({ loading: false, error: err.message || "Error deleting product" });
        }
    },

    // Update product
    updateProduct: async (productId, updatedData) => {
        if (!productId || !updatedData) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `farmer/updateProduct/${productId}`, updatedData);

            if (response?.success) {
                set((state) => {
                    const updateList = (list) => list.map(p => p.id === productId ? response.product : p);
                    return {
                        products: updateList(state.products),
                        userProducts: updateList(state.userProducts),
                        pendingProducts: updateList(state.pendingProducts),
                        loading: false,
                        error: null
                    };
                });
            } else {
                throw new Error("Failed to update product");
            }
        } catch (err) {
            set({ loading: false, error: err.message || "Error updating product" });
        }
    },

    // Fetch pending products for admin
    fetchPendingProducts: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `admin/verifyProduct`);
            set({
                pendingProducts: response.products || [],
                loading: false,
                error: response.products ? null : "No pending products found",
            });
        } catch (err) {
            set({
                pendingProducts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    // Approve a product
    approveProduct: async (productId) => {
        if (!productId) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `admin/approveProduct/${productId}`);

            if (response?.success) {
                set((state) => ({
                    pendingProducts: state.pendingProducts.filter(product => product.id !== productId),
                    loading: false,
                    error: null
                }));
            } else {
                throw new Error("Failed to approve product");
            }
        } catch (err) {
            set({
                loading: false,
                error: err.message
            });
        }
    },

    rejectProduct: async (productId) => {
        if (!productId) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `admin/rejectProduct/${productId}`);

            if (response?.success) {
                set((state) => ({
                    pendingProducts: state.pendingProducts.filter(product => product.id !== productId),
                    loading: false,
                    error: null
                }));
            } else {
                throw new Error("Failed to reject product");
            }
        } catch (err) {
            set({
                loading: false,
                error: err.message || "Error rejecting product"
            });
        }
    }
}));
