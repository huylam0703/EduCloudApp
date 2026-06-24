import axiosClient from '@/lib/apiClient.js'

export const notificationApi = {

  getMyNotifications: () =>
    axiosClient
      .get('/notification/me')
      .then((res) => res.data.result),

  getUnreadCount: () =>
    axiosClient
      .get('/notification/unread-count')
      .then((res) => res.data.result),

  readNotification: (notificationId) =>
    axiosClient
      .patch(`/notification/read/${notificationId}`)
      .then((res) => res.data.result),

  readAllNotifications: () =>
    axiosClient
      .patch('/notification/read-all')
      .then((res) => res.data.result),

  deleteNotification: (notificationId) =>
    axiosClient
      .delete(`/notification/delete/${notificationId}`)
      .then((res) => res.data.result),

  deleteAllNotifications: () =>
    axiosClient
      .delete('/notification/delete-all')
      .then((res) => res.data.result)
}