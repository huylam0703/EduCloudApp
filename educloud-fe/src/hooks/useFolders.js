import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { folderService } from '@/services/folderService'

export function useFolders(parentId = 'root') {
  return useQuery({
    queryKey: ['folders', parentId],
    queryFn: () => folderService.getFolderContents(parentId),
  })
}

export function useBreadcrumb(folderId) {
  return useQuery({
    queryKey: ['breadcrumb', folderId],
    queryFn: () => folderService.getBreadcrumb(folderId),
    enabled: !!folderId && folderId !== 'root',
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: folderService.createFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  })
}
