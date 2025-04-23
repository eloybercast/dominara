import { create } from "zustand";

const useGamemodeStore = create((set, get) => ({
  gamemodes: ["classic_5v5", "pvp_1v1", "story_mode"],

  currentGamemode: "classic_5v5",

  setGamemode: (gamemode) => set({ currentGamemode: gamemode }),

  cycleGamemode: () => {
    const { gamemodes, currentGamemode } = get();
    const currentIndex = gamemodes.indexOf(currentGamemode);
    const nextIndex = (currentIndex + 1) % gamemodes.length;
    set({ currentGamemode: gamemodes[nextIndex] });
  },
}));

export default useGamemodeStore;
