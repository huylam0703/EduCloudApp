import api from './api'

export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/auth/token', { username, password })
    return data
  },
  register: async (payload) => {
    const { data } = await api.post('/users', payload, { skipErrorToast: false })
    return data
  },
  getMyInfo: async () => {
    const { data } = await api.get('/users/myInfo')
    return data
  },
  logout: async (token) => {
    await api.post('/auth/logout', { token })
  },
}
