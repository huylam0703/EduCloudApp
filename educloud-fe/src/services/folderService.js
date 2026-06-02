import api from './api'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockFolders } from '@/mocks/folders'
import { mockDocuments } from '@/mocks/documents'

export const folderService = {
  getFolders: async (parentId = 'root') => {
    if (USE_MOCKS) {
      await delay()
      return mockFolders.filter((f) => f.parentId === parentId || (parentId === 'root' && f.parentId === 'root'))
    }
    const { data } = await api.get('/folders', { params: { parentId } })
    return data
  },
  getFolderContents: async (folderId) => {
    if (USE_MOCKS) {
      await delay()
      const pid = folderId === 'root' ? 'root' : folderId
      const folders = mockFolders.filter((f) => f.parentId === pid)
      const files = mockDocuments.filter((d) =>
        folderId === 'root' ? !d.folderId : d.folderId === folderId
      )
      return { folders, files }
    }
    const { data } = await api.get(`/folders/${folderId}`)
    return data
  },
  createFolder: async (payload) => {
    if (USE_MOCKS) {
      await delay()
      return { id: Date.now().toString(), ...payload, itemCount: 0, createdAt: new Date().toISOString() }
    }
    const { data } = await api.post('/folders', payload)
    return data
  },
  getBreadcrumb: async (folderId) => {
    if (USE_MOCKS) {
      const path = []
      let current = mockFolders.find((f) => f.id === folderId)
      while (current) {
        path.unshift(current)
        current = mockFolders.find((f) => f.id === current.parentId)
      }
      if (path.length === 0 || path[0].id !== 'root') {
        path.unshift(mockFolders.find((f) => f.id === 'root'))
      }
      return path.filter(Boolean)
    }
    const { data } = await api.get(`/folders/${folderId}/breadcrumb`)
    return data
  },
}
