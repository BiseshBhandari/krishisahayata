// import create from "zustand";
// import sendDynamicRequest from "../instance/apiUrl";

// const useVideoStore = create((set) => ({
//     videos: [],
//     loading: false,
//     error: null,

//     fetchVideos: async (adminId) => {
//         if (!adminId) {
//             set({ error: "Admin ID is required", loading: false });
//             return;
//         }

//         set({ loading: true, error: null });

//         try {
//             const response = await sendDynamicRequest("get", `videos/${adminId}`);

//             if (response.videos) {
//                 set({ videos: response.videos, loading: false });
//             } else {
//                 set({ videos: [], loading: false, error: "No videos found" });
//             }
//         } catch (err) {
//             set({ videos: [], loading: false, error: err.message });
//             console.error("Error fetching videos:", err);
//         }
//     }
// }));

// export default useVideoStore;


import { create } from "zustand";
import sendDynamicRequest from "../instance/apiUrl";

const useVideoStore = create((set) => ({
    videos: [],
    loading: false,
    error: null,

    fetchVideos: async (adminId) => {
        set({ loading: true, error: null });

        try {
            const response = await sendDynamicRequest("get", `admin/videos/${adminId}`);

            // console.log("API Response:", response); 

            if (response.videos) {
                set({ videos: response.videos, loading: false });
            } else {
                set({ videos: [], loading: false, error: "No videos found" });
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
            toast.error("Error fetching videos: " + err.message);
            set({ videos: [], loading: false, error: err.message });
        }
    }
}));

export default useVideoStore;
