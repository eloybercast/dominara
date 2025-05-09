import { create } from 'zustand';

const useFriendsMenuStore = create((set) => ({
  isOpen: false,

  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useFriendsMenuStore;
