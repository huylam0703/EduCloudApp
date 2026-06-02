import api from './api'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockAdminStats, mockUsers, mockActivityLogs } from '@/mocks/admin'
import { mockMajors, mockSemesters, mockSubjects } from '@/mocks/categories'
import { mockStorageProviders } from '@/mocks/storage'
import { mockDocuments } from '@/mocks/documents'

export const adminService = {
  getStatistics: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockAdminStats
    }
    const { data } = await api.get('/admin/statistics')
    return data
  },
  getUsers: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockUsers
    }
    const { data } = await api.get('/admin/users')
    return data
  },
  getAllUsers: async () => {
    if (USE_MOCKS) return mockUsers
    const { data } = await api.get('/users')
    return data
  },
  getDocuments: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockDocuments
    }
    const { data } = await api.get('/admin/documents')
    return data
  },
  getMajors: async () => {
    if (USE_MOCKS) {
      await delay(200)
      return mockMajors
    }
    const { data } = await api.get('/majors')
    return data
  },
  getSemesters: async () => {
    if (USE_MOCKS) {
      await delay(200)
      return mockSemesters
    }
    const { data } = await api.get('/semesters')
    return data
  },
  getSubjects: async () => {
    if (USE_MOCKS) {
      await delay(200)
      return mockSubjects
    }
    const { data } = await api.get('/subjects')
    return data
  },
  getActivityLogs: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockActivityLogs
    }
    const { data } = await api.get('/admin/logs')
    return data
  },
  getStorageProviders: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockStorageProviders
    }
    const { data } = await api.get('/admin/storage')
    return data
  },
}
