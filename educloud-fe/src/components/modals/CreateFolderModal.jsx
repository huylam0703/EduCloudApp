import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { folderApi } from '@/api/folderApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' // hoặc lib toast bạn đang dùng

export default function CreateFolderModal({ open, onOpenChange, parentId }) {
  const [folderName, setFolderName] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => folderApi.createFolder(folderName.trim(), parentId || null),
    onSuccess: () => {
      toast.success('Tạo thư mục thành công')
      queryClient.invalidateQueries({ queryKey: ['folders', parentId ?? 'root'] })
      setFolderName('')
      onOpenChange(false)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Tạo thư mục thất bại')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!folderName.trim()) return
    mutate()
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tạo thư mục mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Tên thư mục</Label>
              <Input
                  id="folderName"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Nhập tên thư mục..."
                  autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={!folderName.trim() || isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo thư mục
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}