import { create } from "zustand";
import updateService from "../services/updateService";

const useUpdateStore = create((set, get) => ({
  updateStatus: "",
  errorMessage: "",
  isChecking: false,
  isUpdating: false,
  downloadProgress: {
    downloaded: 0,
    total: 0,
  },

  setUpdateStatus: (status) => set({ updateStatus: status }),
  setErrorMessage: (error) => set({ errorMessage: error }),
  setDownloadProgress: (downloaded, total) => set({ downloadProgress: { downloaded, total } }),
  setIsUpdating: (isUpdating) => set({ isUpdating }),

  checkForUpdates: async () => {
    const { setUpdateStatus, setErrorMessage, setDownloadProgress, setIsUpdating } = get();

    set({ isChecking: true });
    setUpdateStatus("Checking for updates...");
    setErrorMessage("");
    try {
      await updateService.checkForUpdates({
        onStatusChange: setUpdateStatus,
        onError: setErrorMessage,
        onProgress: setDownloadProgress,
        setIsUpdating: setIsUpdating,
      });
    } catch (error) {
      setUpdateStatus("");
    } finally {
      set({ isChecking: false });
    }
  },
}));

export default useUpdateStore;
