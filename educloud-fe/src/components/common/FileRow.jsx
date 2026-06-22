import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { MoreVertical, Pencil, FolderInput } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function FileRow({ doc, onView, onDelete, onRename, onMove }) {
  const { Icon, color } = getFileTypeConfig(doc.type ?? doc.fileType)
  const displayName = doc.name ?? doc.documentName
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Icon className={cn('h-5 w-5', color)} />
          <span className="font-medium">{displayName}</span>
        </div>
      </TableCell>
      <TableCell>{doc.type}</TableCell>
      <TableCell>{formatBytes(doc.size ?? doc.fileSize)}</TableCell>
      <TableCell>{doc.major}</TableCell>
      <TableCell>{doc.subject}</TableCell>
      <TableCell>{formatDate(doc.createdAt)}</TableCell>
      <TableCell>
        <Badge variant={doc.visibility === 'PUBLIC' ? 'success' : 'secondary'}>{doc.visibility}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(doc)}>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename?.(doc)}>
              <Pencil className="mr-2 h-4 w-4" /> Đổi tên
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMove?.(doc)}>
              <FolderInput className="mr-2 h-4 w-4" /> Chuyển thư mục
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(doc)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
