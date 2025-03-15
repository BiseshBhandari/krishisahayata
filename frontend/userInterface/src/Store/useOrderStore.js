import { create } from 'zustand';
import sendDynamicRequest from "../instance/apiUrl";

export const useOrderStore = create((set, get) => ({
    isSubmittingOrder: false,
    orderError: null,
    orderSuccess: false,
    orders: [],
    esewaPayload: null,
    esewaUrl: null,

    createOrder: async (userId, totalPrice) => {
        set({ isSubmittingOrder: true, orderError: null });

        try {
            const response = await sendDynamicRequest("post", 'farmer/createOrder', { userId, totalPrice });
            const data = await response.json();

            if (data.success) {
                set({ orderSuccess: true });
                return { success: true, message: "Order created successfully" };
            } else {
                set({ orderError: data.error || "Order creation failed" });
                return { success: false, message: "Problem while creating Order" };
            }
        } catch (error) {
            set({ orderError: error.message || "Error creating order" });
            return { success: false, message: error.message || "Error creating order" }; // Return error response
        } finally {
            set({ isSubmittingOrder: false });
        }
    },

    getOrders: async (userId) => {
        try {
            if (get().isSubmittingOrder) return;

            const response = await sendDynamicRequest("get", `farmer/getOrders/${userId}`);

            set({
                orders: response.orders,
                esewaPayload: response.esewaPayload,
                esewaUrl: response.esewaUrl
            });
        } catch (error) {
            set({ orderError: "Error fetching orders" });
        }
    },
}));
