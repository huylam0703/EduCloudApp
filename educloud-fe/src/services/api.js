import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/eduCloud',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('educloud-token') || useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false

api.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && typeof data.code === 'number' && data.code !== 1000) {
      const err = new Error(data.message || 'Request failed')
      err.response = response
      return Promise.reject(err)
    }
    if (data && 'result' in data) {
      response.data = data.result
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('educloud-refresh-token')
      if (refreshToken && !isRefreshing) {
        isRefreshing = true
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refesh`,
            { token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )
          const result = res.data?.result || res.data
          const newToken = result?.token
          if (newToken) {
            localStorage.setItem('educloud-token', newToken)
            useAuthStore.getState().setAuth(useAuthStore.getState().user, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            isRefreshing = false
            return api(originalRequest)
          }
        } catch {
          /* fall through */
        }
        isRefreshing = false
      }
      useAuthStore.getState().logout()
      localStorage.removeItem('educloud-token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    if (!error.response) {
      toast.error('Không thể kết nối máy chủ. Vui lòng thử lại.')
    } else {
      const msg = error.response?.data?.message || error.message
      if (!originalRequest?.skipErrorToast) {
        toast.error(msg || 'Đã xảy ra lỗi')
      }
    }
    return Promise.reject(error)
  }
)

export default api
