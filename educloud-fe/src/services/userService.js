import api from './api'

export const userService = {
  updateUser: async (userId, payload) => {
    const { data } = await api.put(`/users/${userId}`, payload)
    return data
  },
}