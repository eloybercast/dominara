import { create } from "zustand";
import { getFriends } from "../../services/backend/friends.service";

const useFriendsStore = create((set, get) => ({
  friends: [],
  isLoading: false,
  error: null,

  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });

      const friendsList = await getFriends();

      set({
        friends: friendsList,
        isLoading: false,
      });

      return friendsList;
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

  clearFriends: () => {
    set({ friends: [], error: null });
  },
}));

export default useFriendsStore;
