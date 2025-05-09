import { create } from 'zustand';
import sendDynamicRequest from "../instance/apiUrl";

export const useOrderStore = create((set, get) => ({
    isSubmittingOrder: false,
    orderError: null,
    orderSuccess: false,
    orders: [],
    customerOrders: [],
    sellerOrders: [],
    esewaPayload: null,
    esewaUrl: null,

    createOrder: async (userId, totalPrice) => {
        set({ isSubmittingOrder: true, orderError: null });

        try {
            const response = await sendDynamicRequest("post", 'farmer/createOrder', { userId, totalPrice });

            if (response.success) {
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

    fetchCustomerOrders: async (userId) => {
        try {

            const response = await sendDynamicRequest("get", `farmer/getCustomerOrderDetails/${userId}`);

            if (response.success) {
                set({ customerOrders: response.orders, orderError: null });
            } else {
                set({ orderError: response.error || "Error fetching customer orders" });
            }
        } catch (error) {
            set({ orderError: "Error fetching customer orders" });
        }
    },

    fetchSellerOrders: async (sellerId) => {
        try {
            const response = await sendDynamicRequest("get", `farmer/getSellerOrderDetails/${sellerId}`);

            if (response.success) {
                set({ sellerOrders: response.orders, orderError: null });
            } else {
                set({ orderError: response.error || "Error fetching seller orders" });
            }
        } catch (error) {
            set({ orderError: "Error fetching seller orders" });
        }
    },

    updateDeliveryStatus: async (orderId, deliveryStatus) => {
        try {
            const response = await sendDynamicRequest("put", `farmer/updateDeliveryStatus/${orderId}`, { deliveryStatus });

            if (response.success) {
                set(state => ({
                    customerOrders: state.customerOrders.map(order => order.id === orderId ? { ...order, deliveryStatus } : order),
                    sellerOrders: state.sellerOrders.map(order => order.id === orderId ? { ...order, deliveryStatus } : order)
                }));
                return { success: true, message: "Delivery status updated successfully" };
            } else {
                set({ orderError: response.error || "Error updating delivery status" });
                return { success: false, message: "Error updating delivery status" };
            }
        } catch (error) {
            set({ orderError: "Internal server error while updating delivery status" });
            return { success: false, message: "Internal server error" };
        }
    },
}));
