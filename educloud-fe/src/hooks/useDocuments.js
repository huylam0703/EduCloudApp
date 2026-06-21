import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '@/services/documentService'
import {documentApi} from '@/api/documentApi.js'
import { toast } from 'sonner'

export function useMyDocuments() {
  return useQuery({
    queryKey: ['myDocuments'],
    queryFn: () => documentApi.getMyDocuments().then((res) => res.data.result),
  })
}

export function usePublicDocuments({ search, majorId, type, pageNo = 0, pageSize = 9 } = {}) {
  return useQuery({
    queryKey: ['public-documents', search, majorId, type, pageNo, pageSize],
    queryFn: () => documentService.getPublicDocuments({ search, majorId, fileType: type, pageNo, pageSize }),
    keepPreviousData: true,
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: documentService.getDashboardStats,
  })
}

export function useChangeDocumentVisibility() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId) => documentApi.changeVisibility(documentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      queryClient.invalidateQueries({ queryKey: ['public-documents'] })
      toast.success(`Đã chuyển sang ${data.result.visibility}`)
    },
    onError: (error) => {
      console.error('CHANGE VISIBILITY ERROR:', error.response?.status, error.response?.data, error.message)
      toast.error('Đổi visibility thất bại')
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId) => documentApi.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      queryClient.invalidateQueries({ queryKey: ['public-documents'] })
      toast.success('Đã xóa tài liệu')
    },
    onError: (error) => {
      console.error('DELETE DOCUMENT ERROR:', error.response?.status, error.response?.data, error.message)
      toast.error('Xóa tài liệu thất bại')
    },
  })
}
