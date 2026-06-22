// src/api/userApi.js
import axiosClient from '@/lib/apiClient.js'

export const userApi = {
  getMyStorage: () =>
    axiosClient.get('/users/myStorage').then((res) => res.data.result),

  getMyInfo: () =>
    axiosClient.get('/users/myInfo').then((res) => res.data.result),
}