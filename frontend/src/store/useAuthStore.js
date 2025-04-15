import {create} from "zustand";
import {axiosInstance} from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isRegistering: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data.data.user});
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

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data.data.user});
            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
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
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data.data.user});
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile: false});
        }
    }

}));