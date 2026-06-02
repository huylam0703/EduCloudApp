import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CloudUpload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { MAJORS, SEMESTERS, SUBJECTS, MAX_SIZES } from '@/constants'
import { formatBytes } from '@/utils/formatBytes'
import { getFileExtension } from '@/utils/fileTypeIcon'
import { useUpload } from '@/hooks/useUpload'

const schema = z.object({
  name: z.string().min(1, 'Nhập tên tài liệu'),
  major: z.string().min(1),
  semester: z.string().min(1),
  subject: z.string().min(1),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
})

export default function UploadModal({ open, onOpenChange, folderId }) {
  const [file, setFile] = useState(null)
  const { mutate, progress, isPending } = useUpload()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'PRIVATE' },
  })
  const major = watch('major')

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) {
      setFile(accepted[0])
      setValue('name', accepted[0].name.replace(/\.[^/.]+$/, ''))
    }
  }, [setValue])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const onSubmit = (data) => {
    if (!file) return
    const ext = getFileExtension(file.name)
    const max = MAX_SIZES[ext]
    if (max && file.size > max) {
      return
    }
    const formData = new FormData()
    formData.append('file', file)
    Object.entries({ ...data, folderId }).forEach(([k, v]) => formData.append(k, v))
    mutate(formData, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>⬆️ Upload tài liệu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive ? 'border-primary bg-primary-light' : 'border-slate-200'
            }`}
          >
            <input {...getInputProps()} />
            <CloudUpload className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-2 text-sm text-slate-600">Kéo file vào đây hoặc click để chọn</p>
            <p className="mt-1 text-xs text-slate-400">
              PDF ≤50MB / DOCX ≤30MB / PPTX ≤100MB / XLSX ≤50MB / ZIP ≤200MB
            </p>
          </div>
          {file && (
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm">
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-slate-500">{formatBytes(file.size)}</span>
            </div>
          )}
          {isPending && <Progress value={progress} className="h-2" />}
          <div>
            <Label>Tên tài liệu</Label>
            <Input className="mt-1" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Chuyên ngành</Label>
              <Select onValueChange={(v) => setValue('major', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn" /></SelectTrigger>
                <SelectContent>
                  {MAJORS.map((m) => (
                    <SelectItem key={m.id} value={m.code}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Học kỳ</Label>
              <Select onValueChange={(v) => setValue('semester', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn" /></SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s.id} value={s.code}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Môn học</Label>
            <Select onValueChange={(v) => setValue('subject', v)} disabled={!major}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn môn" /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.filter((s) => !major || s.majorId === MAJORS.find((m) => m.code === major)?.id).map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant={watch('visibility') === 'PRIVATE' ? 'default' : 'outline'} onClick={() => setValue('visibility', 'PRIVATE')}>
              🔒 PRIVATE
            </Button>
            <Button type="button" variant={watch('visibility') === 'PUBLIC' ? 'default' : 'outline'} onClick={() => setValue('visibility', 'PUBLIC')}>
              🌐 PUBLIC
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={!file || isPending}>
            ⬆️ Upload lên Cloud
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
