import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
