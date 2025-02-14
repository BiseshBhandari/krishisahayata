import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const usePostStore = create((set, get) => ({
    posts: [],
    allPosts: [],
    loading: false,
    error: null,

    fetchAllPosts: async () => {

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/posts`);
            set({
                allPosts: response.posts || [],
                loading: false,
                error: response.posts ? null : "No posts found",
            });
        } catch (err) {
            set({
                allPosts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    fetchUserPosts: async (user_id) => {
        if (!user_id) return;

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/userPost/${user_id}`);
            set({
                posts: response.posts || [],
                loading: false,
                error: response.message ? null : "No posts found",
            });
        } catch (err) {
            set({
                posts: [],
                loading: false,
                error: err.message,
            });
        }
    },
}));