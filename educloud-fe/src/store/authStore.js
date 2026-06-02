import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'educloud-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export function isAdmin(user) {
  return user?.roles?.some((r) => r.name === 'ADMIN')
}

export function getDisplayName(user) {
  if (!user) return 'Người dùng'
  return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
}
