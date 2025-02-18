import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const usePostStore = create((set, get) => ({
    userPosts: [],
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
    // Add a new post
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
}));


