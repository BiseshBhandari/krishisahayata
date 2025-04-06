import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useCommentStore = create((set, get) => ({
    comments: [],
    commentCount: 0,
    commentLoading: false,
    commentError: null,

    fetchComments: async (postId) => {
        if (get().commentLoading) return;

        set({ commentLoading: true, commentError: null });

        try {
            const response = await sendDynamicRequest("get", `/farmer/getComments/${postId}`);

            if (response?.comments) {
                set({ comments: response.comments, commentCount: response.commentCount, commentLoading: false });
            } else {
                throw new Error("No comments found");
            }
        } catch (err) {
            set({ comments: [], commentLoading: false, commentError: err.message });
        }
    },

    addComment: async ({ userId, postId, comment }) => {
        set({ commentLoading: true, commentError: null });

        try {
            const response = await sendDynamicRequest("post", "farmer/addComment", {
                userId,
                postId,
                comment,
            });

            if (response?.comment) {
                set((state) => ({
                    comments: [response.comment, ...state.comments],
                    commentLoading: false,
                }));
            } else {
                throw new Error("Failed to add comment");
            }
        } catch (err) {
            set({ commentLoading: false, commentError: err.message });
        }
    },

    deleteComment: async (commentId) => {
        set({ commentLoading: true, commentError: null });

        try {
            const response = await sendDynamicRequest("delete", `farmer/deleteComment/${commentId}`);

            if (response?.success) {
                set((state) => ({
                    comments: state.comments.filter((comment) => comment.id !== commentId),
                    commentLoading: false,
                }));
            } else {
                throw new Error("Failed to delete comment");
            }
        } catch (err) {
            set({ commentLoading: false, commentError: err.message });
        }
    },

    // New functionality to reply to a comment
    replyToComment: async ({ commentId, userId, reply }) => {
        set({ commentLoading: true, commentError: null });

        try {
            const response = await sendDynamicRequest("post", "/farmer/addReply", {
                commentId,
                user_id: userId,
                reply: reply,
            });

            if (response?.reply) {
                set((state) => ({
                    comments: state.comments.map((comment) =>
                        comment.comment_id === commentId
                            ? { ...comment, Replies: [...(comment.Replies || []), response.reply] }
                            : comment
                    ),
                    commentLoading: false,
                }));
            } else {
                throw new Error("Failed to reply to comment");
            }
        } catch (err) {
            set({ commentLoading: false, commentError: err.message });
        }
    },
}));
