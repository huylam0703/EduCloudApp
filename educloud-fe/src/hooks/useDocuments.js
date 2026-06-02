import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '@/services/documentService'

export function useMyDocuments() {
  return useQuery({
    queryKey: ['myDocuments'],
    queryFn: documentService.getMyDocuments,
  })
}

export function usePublicDocuments(params) {
  return useQuery({
    queryKey: ['publicDocuments', params],
    queryFn: () => documentService.getPublicDocuments(params),
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
