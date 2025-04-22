import { create } from "zustand";
import { getMe, getUserProfile, updateMe, addExperience, getUserCoins } from "../../services/backend/me.service";

const useUserStore = create((set, get) => ({
  user: null,
  profilesCache: {},
  isLoading: false,
  error: null,

  fetchMe: async () => {
    try {
      set({ isLoading: true, error: null });

      const userData = await getMe();

      set({
        user: userData,
        isLoading: false,
      });

      return userData;
    } catch (error) {
      set({
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
        isLoading: false,
      });

      throw error;
    }
  },

  fetchUserProfile: async (userId) => {
    try {
      set({ isLoading: true, error: null });

      const cachedProfile = get().profilesCache[userId];
      if (cachedProfile) {
        set({ isLoading: false });
        return cachedProfile;
      }

      const userProfile = await getUserProfile(userId);

      set((state) => ({
        profilesCache: {
          ...state.profilesCache,
          [userId]: userProfile,
        },
        isLoading: false,
      }));

      return userProfile;
    } catch (error) {
      set({
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
        isLoading: false,
      });

      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const result = await updateMe(userData);

      set({
        user: result.user,
        isLoading: false,
      });

      return result;
    } catch (error) {
      set({
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
        isLoading: false,
      });

      throw error;
    }
  },

  addExperience: async (xp) => {
    try {
      set({ isLoading: true, error: null });

      const result = await addExperience(xp);

      set((state) => ({
        user: {
          ...state.user,
          level: result.newLevel,
          xp: result.newXp,
        },
        isLoading: false,
      }));

      return result;
    } catch (error) {
      set({
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
        isLoading: false,
      });

      throw error;
    }
  },

  fetchCoins: async () => {
    try {
      set({ isLoading: true, error: null });

      const { coins } = await getUserCoins();

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              coins,
            }
          : null,
        isLoading: false,
      }));

      return coins;
    } catch (error) {
      set({
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
        },
        isLoading: false,
      });

      throw error;
    }
  },

  clearUser: () => {
    set({
      user: null,
      profilesCache: {},
      error: null,
    });
  },
}));

export default useUserStore;
