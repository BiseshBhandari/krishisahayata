import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useCartStore = create((set, get) => ({
    cartItems: [],
    totalPrice: null,
    cartloading: false,
    error: null,

    fetchCartItems: async (userID) => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/cart/${userID}`);
            set({
                cartItems: response.cart || [],
                totalPrice: response.totalPrice,
                cartloading: false,
                error: response.cart ? null : "No posts found",
            });
        } catch (err) {
            set({
                allPosts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    addCartItem: async (Items) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("post", 'farmer/addCart', Items);

            if (response?.cart) {
                set((state) => ({
                    cartItems: [response.cart, ...state.cartItems],
                    cartloading: false,
                    error: null,
                }));

            } else {
                throw new Error("Failed to add item");
            }
        } catch (err) {
            set({ cartloading: false, error: err?.message || "Something went wrong" });
        }
    },

    cartCount: () => get().cartItems.reduce((total, item) => total + item.quantity, 0),

}));