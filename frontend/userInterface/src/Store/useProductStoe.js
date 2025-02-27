import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";
import { FaSketch } from "react-icons/fa";

export const useProductStore = create((set, get) => ({
    products: [],
    userProducts: [],
    loading: false,
    error: null,

    addProduct: async (productData, user_ID) => {
        set({ loading: true, error: null });

        try {

            const response = await sendDynamicRequest("post", `farmer/addProduct/${user_ID}`, productData);

            if (response?.product) {
                set((state) => ({
                    products: [response.product, ...state.products],
                    userProducts: response.product.user_id === user_ID ? [response.product, ...state.userProducts] : state.userProducts,
                    loading: false,
                    error: null
                }));
            }
            else {
                throw new Error("Failed to add the product");
            }
        } catch (err) {
            set({ loading: false, error: err?.message || "There was an issue in adding product" });
        }
    },

    fetchAllProducts: async () => {
        if (get().loading) {
            return;
        }
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/products`);
            set({
                products: response.products || [],
                loading: false,
                error: response.products ? response.message : "No posts found",
            });
        } catch (err) {
            set({
                products: [],
                loading: false,
                error: err.message,
            });
        }

    },

}));