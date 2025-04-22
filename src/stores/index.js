import useAuthStore from "./backend/auth";

export const clearAllCaches = () => {
  useAuthStore.getState().clearFormData();
};

export { useAuthStore };
