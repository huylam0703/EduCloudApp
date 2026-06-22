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
}
