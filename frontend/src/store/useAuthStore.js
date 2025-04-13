import {create} from "zustand";
import {axiosInstance} from "../lib/axiosInstance";
import toast from "react-hot-toast";

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
        try {
            set({isRegistering: true});
            const res = await axiosInstance.post("/auth/register", data);
            set({authUser: res.data.data.user});
            toast.success("Account created successfully!");    
        } catch (error) {
            toast.error(error.response.data.message);    
        } finally{
            set({isRegistering: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.success(error.response.data.message);
        }
    }

}));