import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { folderApi } from '@/api/folderApi'
import { documentApi } from '@/api/documentApi'
import { folderService } from '@/services/folderService'

export function useFolders(folderId) {
  const isRoot = !folderId

  return useQuery({
    queryKey: ['folders', folderId ?? 'root'],
    queryFn: async () => {
      if (isRoot) {
        const [foldersRes, docsRes] = await Promise.all([
          folderApi.getAll(),
          documentApi.getMyDocuments(),
        ])
        const folders = foldersRes.data.result
        const files = docsRes.data.result.filter((d) => !d.folderId) // file chưa nằm trong folder nào
        return { folders, files, current: null }
      }

      const res = await folderApi.getDetail(folderId)
      const detail = res.data.result
      return {
        folders: detail.children || [],
        files: detail.documents || [],
        current: detail,
      }
    },
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
