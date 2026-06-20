import apiClient from '@/lib/apiClient'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockDocuments, mockDashboardStats } from '@/mocks/documents'

export const documentService = {
  getMyDocuments: async () => {
    if (USE_MOCKS) {
      await delay()
      return [...mockDocuments]
    }
    const { data } = await apiClient.get('/documents/my-documents')
    return data
  },
  getPublicDocuments: async ({ search = '', majorId = '', fileType = '', pageNo = 0, pageSize = 9 } = {}) => {
    const { data } = await api.get('/document/public', {
      params: {
        pageNo: params.pageNo ?? 1,
        pageSize: params.pageSize ?? 9,
        ...(params.majorId ? { majorId: params.majorId } : {}),
        ...(params.subjectId ? { subjectId: params.subjectId } : {}),
        ...(params.type ? { fileType: params.type } : {}),
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
  upload: async (formData, onProgress) => {
    if (USE_MOCKS) {
      return new Promise((resolve) => {
        let p = 0
        const interval = setInterval(() => {
          p += 20
          onProgress?.(p)
          if (p >= 100) {
            clearInterval(interval)
            resolve({ id: Date.now().toString(), name: 'uploaded.pdf' })
          }
        }, 200)
      })
    }
    const { data } = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / (e.total || 1))),
    })
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
  download: async (id) => {
    if (USE_MOCKS) {
      await delay(200)
      return { url: '#' }
    }
    const { data } = await apiClient.get(`/documents/${id}/download`)
    return data
  },
}
