import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentApi } from '@/api/documentApi'
import { toast } from 'sonner'

export function useUpload() {
  const [progress, setProgress] = useState(0)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData) => documentApi.upload(formData, setProgress),
    onSuccess: (res) => {
      const doc = res.data.result
      toast.success('Upload tài liệu thành công')
      queryClient.invalidateQueries({ queryKey: ['folders', doc.folderId ?? 'root'] })
      setProgress(0)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Upload thất bại')
      setProgress(0)
    },
  })

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    progress,
  }
}