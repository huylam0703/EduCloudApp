import api from './api'

export const userService = {
  getAllUsers: async () => {
    const { data } = await api.get('/users', {
      params: { pageNo: 1, pageSize: 500 },
    })
    return Array.isArray(data) ? data : (data?.content ?? [])
  },

  updateUser: async (userId, payload) => {
    const { data } = await api.put(`/users/${userId}`, payload)
    return data
  },
}