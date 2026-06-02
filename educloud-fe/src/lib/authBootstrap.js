import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

export async function bootstrapAuth() {
  const token = localStorage.getItem('educloud-token')
  const state = useAuthStore.getState()
  if (!token) return

  if (!state.token) {
    useAuthStore.setState({ token, isAuthenticated: true })
  }

  if (!state.user) {
    try {
      const user = await authService.getMyInfo()
      useAuthStore.setState({ user, token, isAuthenticated: true })
    } catch {
      localStorage.removeItem('educloud-token')
      useAuthStore.getState().logout()
    }
  }
}
