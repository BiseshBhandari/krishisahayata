import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

export const useVideoStore = create((set, get) => ({
    videos: [],
    allVideos: [],
    loading: false,
    error: null,

    fetchVideos: async (adminId) => {
        if (!adminId) return;

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `admin/videos/${adminId}`);
            set({
                videos: response.videos || [],
                loading: false,
                error: response.videos ? null : "No videos found",
            });
        } catch (err) {
            set({
                videos: [],
                loading: false,
                error: err.message,
            });
        }
    },

    fetchAllVideos: async () => {

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `farmer/Videos`);
            set({
                allVideos: response.videos || [],
                loading: false,
                error: response.videos ? null : "No videos found",
            });
        } catch (err) {
            set({
                allVideos: [],
                loading: false,
                error: err.message,
            });
        }
    },
}));