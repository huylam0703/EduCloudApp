import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ChevronDown, CloudUpload, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { MAX_SIZES } from '@/constants'
import { formatBytes } from '@/utils/formatBytes'
import { getFileExtension } from '@/utils/fileTypeIcon'
import { cn } from '@/lib/utils'
import { useUpload } from '@/hooks/useUpload'
import { useMajors } from '@/hooks/useMajor'
import { useSubjects } from '@/hooks/useSubject'

const schema = z.object({
  majorId: z.string().min(1, 'Chọn chuyên ngành'),
  subjectId: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
})

// --- Combobox chọn ngành (vừa search vừa chọn) - viết thuần, không cần cmdk/popover ---
function MajorCombobox({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef(null)
  const { majors, isLoading } = useMajors(search)

  const selectedMajor = majors.find((m) => m.id === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
      <div ref={wrapperRef} className="relative">
        <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className="mt-1 w-full justify-between font-normal"
        >
        <span className="truncate">
          {selectedMajor ? selectedMajor.majorName : 'Chọn ngành...'}
        </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md">
              <div className="p-2">
                <Input
                    autoFocus
                    placeholder="Tìm ngành..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm...
                    </div>
                ) : majors.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">Không tìm thấy ngành nào.</p>
                ) : (
                    majors.map((m) => (
                        <button
                            type="button"
                            key={m.id}
                            onClick={() => {
                              onChange(m.id)
                              setOpen(false)
                              setSearch('')
                            }}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-slate-100"
                        >
                          <Check className={cn('h-4 w-4 shrink-0', value === m.id ? 'opacity-100' : 'opacity-0')} />
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate">{m.majorName}</span>
                            <span className="truncate text-xs text-slate-400">{m.majorCode}</span>
                          </div>
                        </button>
                    ))
                )}
              </div>
            </div>
        )}
      </div>
  )
}

export default function UploadModal({ open, onOpenChange, folderId }) {
  const [file, setFile] = useState(null)
  const { mutate, progress, isPending } = useUpload()
  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'PRIVATE' },
  })
  const majorId = watch('majorId')

  const { subjects, isLoading: loadingSubjects } = useSubjects(majorId)

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

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
    formData.append('majorId', data.majorId)
    formData.append('subjectId', data.subjectId)
    formData.append('visibility', data.visibility)
    if (folderId) formData.append('folderId', folderId)

    mutate(formData, {
      onSuccess: () => {
        reset({ visibility: 'PRIVATE' })
        setFile(null)
        onOpenChange(false)
      },
    })
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Chuyên ngành</Label>
                <MajorCombobox
                    value={majorId}
                    onChange={(id) => { setValue('majorId', id); setValue('subjectId', '') }}
                />
                {errors.majorId && <p className="text-xs text-red-500">{errors.majorId.message}</p>}
              </div>

              <div>
                <Label>Môn học</Label>
                <Select
                    disabled={!majorId || loadingSubjects}
                    onValueChange={(v) => setValue('subjectId', v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={
                      !majorId ? 'Chọn ngành trước' : loadingSubjects ? 'Đang tải...' : 'Chọn môn'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.subjectName} ({s.subjectCode})
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjectId && <p className="text-xs text-red-500">{errors.subjectId.message}</p>}
              </div>
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
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              ⬆️ Upload lên Cloud
            </Button>
          </form>
        </DialogContent>
      </Dialog>
  )
}