import { motion } from 'framer-motion'
import { MoreVertical, Lock, Globe, Eye, Pencil, FolderInput } from 'lucide-react'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FileCard({ doc, onPreview, onDelete, onToggleVisibility, onRename, onMove }) {
  const { Icon, color, bg, badge } = getFileTypeConfig(doc.fileType)

  return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card
            className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
            onClick={() => onPreview?.(doc)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={cn('rounded-xl p-3', bg)}>
                <Icon className={cn('h-8 w-8', color)} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onPreview?.(doc)}>
                    <Eye className="mr-2 h-4 w-4" /> Xem trước
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRename?.(doc)}>
                    <Pencil className="mr-2 h-4 w-4" /> Đổi tên
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onMove?.(doc)}>
                    <FolderInput className="mr-2 h-4 w-4" /> Chuyển thư mục
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleVisibility?.(doc)}>Đổi visibility</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(doc)}>Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mt-3 truncate font-medium text-slate-900" title={doc.documentName}>
              {doc.documentName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatBytes(doc.fileSize)} · {formatDate(doc.createdAt)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', badge)}>{doc.fileType}</span>
              <Badge variant="outline" className="gap-1 text-xs">
                {doc.visibility === 'PUBLIC' ? (<><Globe className="h-3 w-3" /> PUBLIC</>) : (<><Lock className="h-3 w-3" /> PRIVATE</>)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  )
}