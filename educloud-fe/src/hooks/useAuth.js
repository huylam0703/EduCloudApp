import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async ({ username, password, remember }) => {
      const auth = await authService.login(username, password)
      localStorage.setItem('educloud-token', auth.token)
      if (remember) localStorage.setItem('educloud-remember', username)
      else localStorage.removeItem('educloud-remember')
      const user = await authService.getMyInfo()
      setAuth(user, auth.token)
      return user
    },
    onSuccess: () => {
      toast.success('Đăng nhập thành công')
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: () => {
      toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.')
      navigate('/login')
    },
  })
}

export function useMyInfo() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['myInfo'],
    queryFn: authService.getMyInfo,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    localStorage.removeItem('educloud-token')
    logout()
    queryClient.clear()
    navigate('/login')
  }
}
