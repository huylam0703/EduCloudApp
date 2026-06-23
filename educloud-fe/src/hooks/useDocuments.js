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

export function usePublicDocuments({ majorId, subjectId, type, pageNo = 1, pageSize = 9, searchCounter = 0 } = {}) {
  return useQuery({
    queryKey: ['public-documents', majorId, subjectId, type, pageNo, pageSize, searchCounter],
    queryFn: () =>
      documentApi.getPublicDocuments({
        majorId,
        subjectId,
        fileType: type,
        pageNo,
        pageSize,
      }),
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
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] })
      queryClient.invalidateQueries({ queryKey: ['myStorage'] })
      toast.success('Đã xóa tài liệu')
    },
    onError: (error) => {
      console.error('DELETE DOCUMENT ERROR:', error.response?.status, error.response?.data, error.message)
      toast.error(error.response?.data?.message || 'Xóa tài liệu thất bại')
    },
  })
}

function invalidateDocumentQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['folders'] })
  queryClient.invalidateQueries({ queryKey: ['myDocuments'] })
  queryClient.invalidateQueries({ queryKey: ['public-documents'] })
}

export function useDocumentActions() {
  const queryClient = useQueryClient()

  const renameMutation = useMutation({
    mutationFn: ({ documentId, documentName }) =>
      documentApi.renameDocument(documentId, documentName),
    onSuccess: () => {
      invalidateDocumentQueries(queryClient)
      toast.success('Đã đổi tên tài liệu')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đổi tên tài liệu thất bại')
    },
  })

  const moveMutation = useMutation({
    mutationFn: ({ documentId, folderId }) =>
      documentApi.moveDocument(documentId, folderId),
    onSuccess: () => {
      invalidateDocumentQueries(queryClient)
      toast.success('Đã chuyển tài liệu')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Chuyển tài liệu thất bại')
    },
  })

  const handleRenameDocument = (documentId, documentName) =>
    renameMutation.mutateAsync({ documentId, documentName })

  const handleMoveDocument = (documentId, folderId) =>
    moveMutation.mutateAsync({ documentId, folderId })

  return {
    handleRenameDocument,
    handleMoveDocument,
    isRenaming: renameMutation.isPending,
    isMoving: moveMutation.isPending,
  }
}
