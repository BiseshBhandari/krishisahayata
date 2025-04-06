import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useLikeStore = create((set, get) => ({
    likedPosts: [],   // Stores the liked post IDs
    likeLoading: false,
    likeError: null,

    // Fetch liked posts and store the post IDs
    fetchLikedPosts: async (userId) => {
        if (get().likeLoading) return;

        set({ likeLoading: true, likeError: null });

        try {
            const response = await sendDynamicRequest("get", `/farmer/getLikedposts/${userId}`);

            if (response?.likedPost) {
                // Extract post_ids from the response and store them in likedPosts
                const likedPostIds = response.likedPost.map(post => post.post_id);
                set({
                    likedPosts: likedPostIds,
                    likeLoading: false,
                });
            } else {
                throw new Error("Failed to fetch liked posts");
            }
        } catch (err) {
            set({ likeLoading: false, likeError: err.message });
        }
    },

    // Handle like/unlike post
    likeUnlikePost: async ({ userId, postId }) => {
        set({ likeLoading: true, likeError: null });

        try {
            const response = await sendDynamicRequest("put", "/farmer/likePost", {
                user_id: userId,
                post_id: postId,
            });

            if (response?.liked === true) {
                // Post was liked, add post_id to likedPosts
                set((state) => ({
                    likedPosts: [...state.likedPosts, postId],
                    likeLoading: false,
                }));
            } else if (response?.liked === false) {
                // Post was unliked, remove post_id from likedPosts
                set((state) => ({
                    likedPosts: state.likedPosts.filter(id => id !== postId),
                    likeLoading: false,
                }));
            } else {
                throw new Error("Failed to like/unlike post");
            }
        } catch (err) {
            set({ likeLoading: false, likeError: err.message });
        }
    }
}));
