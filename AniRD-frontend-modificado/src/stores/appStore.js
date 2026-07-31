import { createStore } from 'zustand/vanilla';

export const useAppStore = createStore((set) => ({
  theme: 'dark',
  isDataSaver: false,
  setTheme: (theme) => set({ theme }),
  toggleDataSaver: () => set((state) => ({ isDataSaver: !state.isDataSaver })),

  // Navigation State
  currentRoute: '/',
  setCurrentRoute: (route) => set({ currentRoute: route }),

  // Search State
  isSearchOpen: false,
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
}));
