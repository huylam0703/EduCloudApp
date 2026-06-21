import apiClient from '@/lib/apiClient'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockDocuments, mockDashboardStats } from '@/mocks/documents'

export const documentService = {
  getPublicDocuments: async ({
                               search = '',
                               majorId = '',
                               subjectId = '',
                               fileType = '',
                               pageNo = 0,
                               pageSize = 9
                             } = {}) => {
    const { data } = await apiClient.get('/document/public', {
      params: {
        search,
        pageNo,
        pageSize,
        ...(majorId && { majorId }),
        ...(subjectId && { subjectId }),
        ...(fileType && { fileType }),
      },
    })

    return data.result
  },
  getDashboardStats: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockDashboardStats
    }
    const { data } = await apiClient.get('/documents/stats')
    return data
  },

  delete: async (id) => {
    if (USE_MOCKS) {
      await delay(200)
      return { success: true }
    }
    const { data } = await apiClient.delete(`/documents/${id}`)
    return data
  },
  downloadDocument: async (documentId) => {
    const response = await apiClient.get(
        `/document/download/${documentId}`,
        {
          responseType: 'blob',
        }
    )

    return response.data
  },
}
