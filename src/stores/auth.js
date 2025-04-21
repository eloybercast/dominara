import { create } from "zustand";
import { processDeepLink } from "../services/backend/auth.service";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  formData: {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  },

  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),

  checkAuth: () => get().isAuthenticated,

  updateFormData: (data) =>
    set({
      formData: { ...get().formData, ...data },
    }),
  clearFormData: () =>
    set({
      formData: { username: "", email: "", password: "", repeatPassword: "" },
    }),

  handleDeepLink: async (url) => {
    try {
      const result = await processDeepLink(url);
      if (result.success && result.user) {
        set({ isAuthenticated: true, user: result.user });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Deep link authentication failed:", error);
      return false;
    }
  },

  initializeAuth: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      set({ isAuthenticated: true, user: JSON.parse(user) });
      return true;
    }
    return false;
  },
}));

export default useAuthStore;
