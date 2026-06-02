import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateFolder } from '@/hooks/useFolders'

const schema = z.object({
  name: z.string().min(1, 'Nhập tên thư mục'),
  parentId: z.string().optional(),
})

export default function CreateFolderModal({ open, onOpenChange, parentId = 'root' }) {
  const createFolder = useCreateFolder()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { parentId },
  })

  const onSubmit = (data) => {
    createFolder.mutate(data, {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📁 Tạo thư mục</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Tên thư mục</Label>
            <Input className="mt-1" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <input type="hidden" {...register('parentId')} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createFolder.isPending}>
              Tạo thư mục
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
