import api from './api'

export const notificationService = {
getTemplates: async () => {
const { data } = await api.get('/notification/templates')
return data
},

sendTemplate: async ({ userId, templateCode }) => {
const { data } = await api.post(
'/notification/send-template',
{ userId, templateCode },
{ skipErrorToast: true }
)
return data
},

sendTemplateToAll: async ({ templateCode }) => {
const { data } = await api.post(
'/notification/send-template/all',
{ templateCode },
{ skipErrorToast: true }
)
return data
},

getMyNotifications: async () => {
  const { data } = await api.get('/notification/me')
  return data.content || []
},

getUnreadCount: async () => {
const { data } = await api.get('/notification/unread-count')
return data
},

readNotification: async (notificationId) => {
const { data } = await api.patch(
`/notification/read/${notificationId}`
)
return data
},

readAllNotifications: async () => {
const { data } = await api.patch(
'/notification/read-all'
)
return data
},

deleteNotification: async (notificationId) => {
const { data } = await api.delete(
`/notification/delete/${notificationId}`
)
return data
},

deleteAllNotifications: async () => {
const { data } = await api.delete(
'/notification/delete-all'
)
return data
}
}
