import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: 'learn' | 'explore' | 'challenges';
  toggleSidebar: () => void;
  setActiveTab: (tab: 'learn' | 'explore' | 'challenges') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'learn',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
