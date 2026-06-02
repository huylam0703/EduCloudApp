import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { documentService } from '@/services/documentService'

export function useUpload() {
  const [progress, setProgress] = useState(0)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData) => documentService.upload(formData, setProgress),
    onSuccess: () => {
      toast.success('Upload thành công!')
      setProgress(0)
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    },
    onError: () => {
      setProgress(0)
      toast.error('Upload thất bại')
    },
  })

  return { ...mutation, progress, setProgress }
}
