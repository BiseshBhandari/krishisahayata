import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useCartStore = create((set, get) => ({
    cartItems: [],
    totalPrice: null,
    cartloading: false,
    error: null,

    fetchCartItems: async (userID) => {
        if (get().cartloading) return;

        set({ cartloading: true, error: null });

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
                cartItems: [],
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
                    totalPrice: response.totalPrice,
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

    removeCartItem: async (userId, productId) => {
        try {
            const response = await sendDynamicRequest("delete", "farmer/removeItem", { userId, productId });

            if (response.success) {
                set((state) => ({
                    cartItems: state.cartItems.filter(item => item.productId !== productId),
                    totalPrice: response.totalPrice,
                }));
            }
        } catch (err) {
            set({ error: err.message, cartloading: false });
        }
    },

    cartCount: () => get().cartItems.reduce((total, item) => total + item.quantity, 0),

    increaseCartItem: async (userId, productId) => {
        try {
            const response = await sendDynamicRequest("post", "farmer/addQuantity", { userId, productId });


            set((state) => ({
                totalPrice: response.totalPrice,
                cartItems: state.cartItems.map(item =>
                    item.productId === productId ? { ...item, quantity: item.quantity + 1, total: item.total + item.price } : item
                ),
            }));
        } catch (err) {
            set({ error: err.message, cartloading: false });
        }
    },

    decreaseCartItem: async (userId, productId) => {
        try {
            const response = await sendDynamicRequest("post", "farmer/decreaseQuantity", { userId, productId });

            set((state) => ({
                cartItems: response.message === "Item removed from cart"
                    ? state.cartItems.filter(item => item.productId !== productId) // Remove item if deleted
                    : state.cartItems.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity - 1, total: item.total - item.price }
                            : item
                    ),
                totalPrice: response.totalPrice,
            }));
        } catch (err) {
            set({ error: err.message });
        }
    },

    clearCart: async (userId) => {
        try {
            const response = await sendDynamicRequest("delete", `farmer/clearCart/${userId}`);

            if (response.success) {
                set({
                    cartItems: [],
                    totalPrice: 0,
                    cartloading: false,
                    error: null,
                });
            }
        } catch (err) {
            set({ error: err.message, cartloading: false });
        }
    },

}));