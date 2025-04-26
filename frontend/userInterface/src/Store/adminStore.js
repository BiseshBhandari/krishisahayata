import { create } from 'zustand';
import sendDynamicRequest from '../instance/apiUrl'; // Adjust path

export const useAdminStore = create((set, get) => ({
    metrics: {},
    pendingItems: { posts: [], products: [] },
    postTrends: { approved: 0, pending: 0, rejected: 0 },
    productStatus: { approved: 0, pending: 0, rejected: 0 },
    loading: false,
    error: null,

    fetchDashboardData: async (adminId) => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const [metricsRes, pendingItemsRes, postTrendsRes, productStatusRes] = await Promise.all([
                sendDynamicRequest('get', `admin/metrics/${adminId}`),
                sendDynamicRequest('get', `admin/pending-items/${adminId}`),
                sendDynamicRequest('get', `admin/post-trends/${adminId}`),
                sendDynamicRequest('get', `admin/product-status/${adminId}`),
            ]);

            set({
                metrics: metricsRes.metrics || {},
                pendingItems: pendingItemsRes.pendingItems || { posts: [], products: [] },
                postTrends: postTrendsRes.postTrends || { approved: 0, pending: 0, rejected: 0 },
                productStatus: productStatusRes.productStatus || { approved: 0, pending: 0, rejected: 0 },
                loading: false,
                error: null,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.message || 'Failed to fetch dashboard data',
            });
        }
    },
}));