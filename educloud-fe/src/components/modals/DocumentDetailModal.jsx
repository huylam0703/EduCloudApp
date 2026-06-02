import { Download, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'
import { cn } from '@/lib/utils'

export default function DocumentDetailModal({ doc, open, onOpenChange, isOwner, onDelete }) {
  if (!doc) return null
  const { Icon, color, bg } = getFileTypeConfig(doc.type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết tài liệu</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className={cn('flex min-h-[200px] items-center justify-center rounded-xl', bg)}>
            {doc.type === 'PDF' ? (
              <iframe title="preview" src="#" className="h-full min-h-[200px] w-full rounded-lg bg-white" />
            ) : (
              <Icon className={cn('h-24 w-24', color)} />
            )}
          </div>
          <div className="space-y-3 text-sm">
            <h3 className="text-lg font-semibold">{doc.name}</h3>
            <p><span className="text-slate-500">Loại:</span> {doc.type}</p>
            <p><span className="text-slate-500">Dung lượng:</span> {formatBytes(doc.size)}</p>
            <p><span className="text-slate-500">Chuyên ngành:</span> {doc.major}</p>
            <p><span className="text-slate-500">Môn:</span> {doc.subject}</p>
            <p><span className="text-slate-500">Học kỳ:</span> {doc.semester}</p>
            <p><span className="text-slate-500">Người tải:</span> {doc.uploader?.name}</p>
            <p><span className="text-slate-500">Ngày:</span> {formatDate(doc.createdAt)}</p>
            <p><span className="text-slate-500">Lượt tải:</span> {doc.downloadCount || 0}</p>
            <Badge>{doc.visibility}</Badge>
            <Button className="w-full gap-2">
              <Download className="h-4 w-4" /> ⬇️ Tải xuống
            </Button>
            {isOwner && (
              <Button variant="destructive" className="w-full gap-2" onClick={() => onDelete?.(doc)}>
                <Trash2 className="h-4 w-4" /> Xóa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
