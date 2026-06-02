import api from './api'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockDocuments, mockDashboardStats } from '@/mocks/documents'

export const documentService = {
  getMyDocuments: async () => {
    if (USE_MOCKS) {
      await delay()
      return [...mockDocuments]
    }
    const { data } = await api.get('/documents/my-documents')
    return data
  },
  getPublicDocuments: async (params = {}) => {
    if (USE_MOCKS) {
      await delay()
      let docs = mockDocuments.filter((d) => d.visibility === 'PUBLIC')
      if (params.search) {
        const q = params.search.toLowerCase()
        docs = docs.filter((d) => d.name.toLowerCase().includes(q))
      }
      if (params.major) docs = docs.filter((d) => d.major === params.major)
      if (params.type) docs = docs.filter((d) => d.type === params.type)
      return docs
    }
    const { data } = await api.get('/documents', { params })
    return data
  },
  getDashboardStats: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockDashboardStats
    }
    const { data } = await api.get('/documents/stats')
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
    const { data } = await api.post('/documents/upload', formData, {
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
    const { data } = await api.delete(`/documents/${id}`)
    return data
  },
  download: async (id) => {
    if (USE_MOCKS) {
      await delay(200)
      return { url: '#' }
    }
    const { data } = await api.get(`/documents/${id}/download`)
    return data
  },
}
