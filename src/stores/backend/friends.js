import { create } from "zustand";
import { getFriends, sendFriendRequest } from "../../services/backend/friends.service";

const useFriendsStore = create((set, get) => ({
  friends: [],
  isLoading: false,
  error: null,
  sendRequestStatus: {
    loading: false,
    success: false,
    error: null
  },

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

  sendRequest: async (username) => {
    try {
      set({ 
        sendRequestStatus: { 
          loading: true, 
          success: false, 
          error: null 
        } 
      });

      const result = await sendFriendRequest(username);

      set({
        sendRequestStatus: { 
          loading: false, 
          success: true,
          error: null
        }
      });

      return result;
    } catch (error) {
      set({
        sendRequestStatus: {
          loading: false,
          success: false,
          error: {
            message: error.message,
            code: error.code,
            status: error.status,
          }
        }
      });

      throw error;
    }
  },

  resetSendRequestStatus: () => {
    set({
      sendRequestStatus: {
        loading: false,
        success: false,
        error: null
      }
    });
  },

  clearFriends: () => {
    set({ friends: [], error: null });
  },
}));

export default useFriendsStore;
