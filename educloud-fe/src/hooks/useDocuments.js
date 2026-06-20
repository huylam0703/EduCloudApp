import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '@/services/documentService'

export function useMyDocuments() {
  return useQuery({
    queryKey: ['myDocuments'],
    queryFn: documentService.getMyDocuments,
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

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
  })
}
