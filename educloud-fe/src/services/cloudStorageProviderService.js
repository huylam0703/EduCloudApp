import api from './api'

export const cloudStorageProviderService = {
  getCloudStorageInfo: async () => {
    const { data } = await api.get('/cloud-storage/info', { skipErrorToast: true })
    return data
  },

  createProvider: async (payload) => {
    const { data } = await api.post('/cloud-storage/provider', payload, {
      skipErrorToast: true,
    })
    return data
  },
}
