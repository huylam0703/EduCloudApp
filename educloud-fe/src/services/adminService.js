import api from './api'
import { delay, USE_MOCKS } from '@/mocks/delay'
import { mockAdminStats, mockUsers, mockActivityLogs } from '@/mocks/admin'
import { mockMajors, mockSemesters, mockSubjects } from '@/mocks/categories'
import { mockStorageProviders } from '@/mocks/storage'
import { mockDocuments } from '@/mocks/documents'
import { formatBytes } from '@/utils/formatBytes'

function adaptDashboard(raw) {
  return {
    totalUsers: raw.totalUsers ?? 0,
    totalDocuments: raw.totalDocuments ?? 0,
    totalStorageDisplay: raw.totalStorageDisplay ?? formatBytes(raw.totalStorageBytes ?? 0),
    totalUploads: raw.totalUploads ?? 0,
    totalDownloads: raw.totalDownloads ?? 0,
    deletedDocuments: raw.deletedDocuments ?? 0,
    uploadLast7Days: raw.uploadLast7Days ?? [],
    majorDistribution: raw.majorDistribution ?? [],
  }
}

export const adminService = {
  getDashboard: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockAdminStats
    }
    const { data } = await api.get('/admin/dashboard')
    return adaptDashboard(data)
  },

  getStatistics: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockAdminStats
    }
    const { data } = await api.get('/admin/dashboard')
    return adaptDashboard(data)
  },

  getAllUsers: async () => {
    if (USE_MOCKS) return mockUsers
    const { data } = await api.get('/users', { params: { pageNo: 1, pageSize: 500 } })
    return Array.isArray(data) ? data : (data?.content ?? [])
  },

  getUsers: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockUsers
    }
    const { data } = await api.get('/users', { params: { pageNo: 1, pageSize: 500 } })
    return Array.isArray(data) ? data : (data?.content ?? [])
  },

  getDocuments: async () => {
    if (USE_MOCKS) {
      await delay()
      return mockDocuments
    }
    const { data } = await api.get('/document/MyDocument')
    return Array.isArray(data) ? data : (data?.content ?? [])
  },

  getMajors: async () => {
    if (USE_MOCKS) {
      await delay(200)
      return mockMajors
    }
    const { data } = await api.get('/base/majors')
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
    const { data } = await api.get('/activity-log/all')
    return Array.isArray(data) ? data : (data?.content ?? [])
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