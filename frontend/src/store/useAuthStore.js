import {create} from "zustand";
import {axiosInstance} from "../lib/axiosInstance";

export const useAuthStore = create((set) => ({
    authUser: null,
    isRegistering: false,
    isLogingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data.user});
        } catch (error) {
            console.log("Error checking auth:", error);
            set({authUser: null});
        }finally{  
            set({isCheckingAuth: false})
        }
    },

    register: async (data) => {

    }

}));