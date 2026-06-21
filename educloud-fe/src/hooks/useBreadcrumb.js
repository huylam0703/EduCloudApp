import { useQuery } from '@tanstack/react-query'
import { folderApi } from '@/api/folderApi'

async function buildBreadcrumb(folderId) {
    const chain = []
    let currentId = folderId
    while (currentId) {
        const res = await folderApi.getDetail(currentId)
        const folder = res.data.result
        chain.unshift({ id: folder.id, name: folder.folderName })
        currentId = folder.parentFolderId
    }
    return chain
}

export function useBreadcrumb(folderId) {
    return useQuery({
        queryKey: ['breadcrumb', folderId],
        queryFn: () => buildBreadcrumb(folderId),
        enabled: !!folderId,
        staleTime: 60_000,
    })
}