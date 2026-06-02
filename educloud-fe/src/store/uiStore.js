import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      viewMode: 'grid',
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'educloud-ui', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, viewMode: s.viewMode }) }
  )
)
