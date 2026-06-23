import apiClient from '@/lib/apiClient'
import { documentApi } from '@/api/documentApi'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockDashboardStats } from '@/mocks/documents'

export const documentService = {
  getPublicDocuments: (params) => documentApi.getPublicDocuments(params),

  getDashboardStats: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockDashboardStats
    }
    const { data } = await apiClient.get('/documents/stats')
    return data
  },

  downloadDocument: async (documentId) => {
    const response = await apiClient.get(`/document/download/${documentId}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
