import { create } from "zustand";

const TRANSITION_DURATION = 300;

const useLobbbyModeStore = create((set, get) => ({
  selectedMode: "play",
  isExiting: false,
  pendingMode: null,

  setSelectedModeImmediate: (mode) => set({ selectedMode: mode, pendingMode: null }),

  setSelectedMode: (mode) => {
    const current = get().selectedMode;

    if (current === mode || get().isExiting) return;

    set({ isExiting: true, pendingMode: mode });

    setTimeout(() => {
      set({
        selectedMode: mode,
        isExiting: false,
        pendingMode: null,
      });
    }, TRANSITION_DURATION);
  },

  cancelTransition: () => {
    set({
      isExiting: false,
      pendingMode: null,
    });
  },
}));

export default useLobbbyModeStore;
