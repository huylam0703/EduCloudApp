import { Navigate } from 'react-router-dom'
import { useAuthStore, isAdmin } from '@/store/authStore'

export default function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user)

  if (!isAdmin(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
