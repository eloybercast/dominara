import useAuthStore from "./auth";

export const clearAllCaches = () => {
  useAuthStore.getState().clearFormData();
};

export { useAuthStore };
