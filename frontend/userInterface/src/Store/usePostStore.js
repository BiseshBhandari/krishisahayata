import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const usePostStore = create((set, get) => ({
    userPosts: [],
    allPosts: [],
    pendingPosts: [],
    loading: false,
    error: null,
    
    fetchAllPosts: async (user_id) => {
        if (!user_id || get().loading) return;

        console.log("fetchAllPosts called with user_id:", user_id); // helpful debug

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/posts/${user_id}`);
            console.log("fetchAllPosts response:", response);

            const posts = Array.isArray(response.posts) ? response.posts : [];

            set({
                allPosts: posts,
                loading: false,
                error: posts.length ? null : "No approved posts available",
            });
        } catch (err) {
            console.error("fetchAllPosts error:", err.response || err.message, err);
            set({
                allPosts: [],
                loading: false,
                error: err.message || "Failed to fetch posts",
            });
        }
    },

    fetchUserPosts: async (user_id) => {
        if (!user_id || get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/userPost/${user_id}`);
            console.log("fetchUserPosts response:", response);
            const posts = response.userPosts || response.posts || response || [];
            if (!Array.isArray(posts)) {
                console.warn("fetchUserPosts: Expected array, received:", posts);
            }
            set({
                userPosts: Array.isArray(posts) ? posts : [],
                loading: false,
                error: posts.length ? null : "No user posts found",
            });
        } catch (err) {
            console.error("fetchUserPosts error:", err.message, err);
            set({
                userPosts: [],
                loading: false,
                error: err.message || "Failed to fetch user posts",
            });
        }
    },

    fetchPendingPosts: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `admin/verifyPost`);
            console.log("fetchPendingPosts response:", response);
            const posts = response.post || response.posts || response || [];
            set({
                pendingPosts: Array.isArray(posts) ? posts : [],
                loading: false,
                error: posts.length ? null : "No pending posts found",
            });
        } catch (err) {
            console.error("fetchPendingPosts error:", err);
            set({
                pendingPosts: [],
                loading: false,
                error: err.message || "Failed to fetch pending posts",
            });
        }
    },

    addPost: async (newPost, user_id) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("post", `farmer/addPost/${user_id}`, newPost);
            console.log("addPost response:", response);

            if (response?.post) {
                set((state) => ({
                    allPosts: response.post.approval_status === "approved" ? [response.post, ...state.allPosts] : state.allPosts,
                    userPosts: response.post.user_id === user_id ? [response.post, ...state.userPosts] : state.userPosts,
                    pendingPosts: response.post.approval_status === "pending" ? [response.post, ...state.pendingPosts] : state.pendingPosts,
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to add post");
            }
        } catch (err) {
            console.error("addPost error:", err);
            set({ loading: false, error: err?.message || "Something went wrong" });
            throw err;
        }
    },

    approvePost: async (post_id, status) => {
        if (!post_id || !status) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `admin/approvePost/${post_id}`, { status });
            console.log("approvePost response:", response);

            if (response?.success) {
                set((state) => ({
                    pendingPosts: state.pendingPosts.filter((post) => post.id !== post_id),
                    allPosts: status === "approved" ? [...state.allPosts, state.pendingPosts.find((post) => post.id === post_id)] : state.allPosts,
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to approve post");
            }
        } catch (err) {
            console.error("approvePost error:", err);
            set({ loading: false, error: err.message || "Failed to approve post" });
        }
    },

    editPost: async (post_id, updatedData) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("put", `farmer/updatePost/${post_id}`, updatedData);
            console.log("editPost response:", response);

            if (response?.post) {
                set((state) => ({
                    allPosts: state.allPosts.map((post) =>
                        post.post_id === post_id ? response.post : post
                    ),
                    userPosts: state.userPosts.map((post) =>
                        post.post_id === post_id ? response.post : post
                    ),
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to update post");
            }
        } catch (err) {
            console.error("editPost error:", err);
            set({ loading: false, error: err?.message || "Something went wrong" });
            throw err;
        }
    },

    deletePost: async (post_id) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("delete", `farmer/deletePost/${post_id}`);
            console.log("deletePost response:", response);

            if (response?.message) {
                set((state) => ({
                    allPosts: state.allPosts.filter((post) => post.post_id !== post_id),
                    userPosts: state.userPosts.filter((post) => post.post_id !== post_id),
                    pendingPosts: state.pendingPosts.filter((post) => post.post_id !== post_id),
                    loading: false,
                    error: null,
                }));
            } else {
                throw new Error("Failed to delete post");
            }
        } catch (err) {
            console.error("deletePost error:", err);
            set({ loading: false, error: err?.message || "Something went wrong" });
            throw err;
        }
    },

    updateLikeCount: (postId, increment = 1) => {
        set((state) => ({
            allPosts: state.allPosts.map((post) =>
                post.post_id === postId
                    ? { ...post, likeCount: (post.likeCount || 0) + increment }
                    : post
            ),
            userPosts: state.userPosts.map((post) =>
                post.post_id === postId
                    ? { ...post, likeCount: (post.likeCount || 0) + increment }
                    : post
            ),
        }));
    },

    updateCommentCount: (postId, increment = 1) => {
        set((state) => ({
            allPosts: state.allPosts.map((post) =>
                post.post_id === postId
                    ? { ...post, commentCount: (post.commentCount || 0) + increment }
                    : post
            ),
            userPosts: state.userPosts.map((post) =>
                post.post_id === postId
                    ? { ...post, commentCount: (post.commentCount || 0) + increment }
                    : post
            ),
        }));
    },
}));