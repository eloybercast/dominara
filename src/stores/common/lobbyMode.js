import { create } from "zustand";

const useLobbbyModeStore = create((set) => ({
  selectedMode: "play",
  setSelectedMode: (mode) => set({ selectedMode: mode }),
}));

export default useLobbbyModeStore;
