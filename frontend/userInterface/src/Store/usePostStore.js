import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const usePostStore = create((set, get) => ({
    userPosts: [],
    allPosts: [],
    pendingPosts: [],
    loading: false,
    error: null,

    fetchAllPosts: async () => {

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/posts`);
            set({
                allPosts: response.post || [],
                loading: false,
                error: response.post ? null : "No posts found",
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
                userPosts: response.posts || [],
                loading: false,
                error: response.message ? null : "No posts found",
            });
        } catch (err) {
            set({
                userPosts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    fetchPendingPosts: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `admin/verifyPost`);
            set({
                pendingPosts: response.post || [],
                loading: false,
                error: response.post ? null : "No posts found",
            });
        } catch (err) {
            set({
                pendingPosts: [],
                loading: false,
                error: err.message,
            });
        }
    },

    addPost: async (newPost, user_id) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("post", `farmer/addPost/${user_id}`, newPost);

            if (response?.post) {
                set((state) => ({
                    allPosts: [response.post, ...state.allPosts],
                    userPosts: newPost.user_id === response.post.user_id ? [response.post, ...state.userPosts] : state.userPosts,
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to add post");
            }
        } catch (err) {
            set({ loading: false, error: err?.message || "Something went wrong" });
        }
    },

    approvePost: async (post_id, status) => {
        if (!post_id || !status) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `admin/approvePost/${post_id}`, { status });

            if (response?.success) {
                set((state) => ({
                    pendingPosts: state.pendingPosts.filter(post => post.id !== post_id),
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to approve post");
            }
        } catch (err) {
            set({ loading: false, error: err.message });
        }
    },
}));


