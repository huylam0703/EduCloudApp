import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import DataTable from '@/components/admin/DataTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useDeleteDocument } from '@/hooks/useDocuments'

export default function DocumentManagementPage() {
  const { data: docs, isLoading } = useQuery({
    queryKey: ['adminDocuments'],
    queryFn: adminService.getDocuments,
  })
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const deleteDoc = useDeleteDocument()

  const filtered = (docs || []).filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'owner', label: 'Owner', render: (d) => d.uploader?.name },
    { key: 'major', label: 'Major' },
    { key: 'subject', label: 'Subject' },
    { key: 'size', label: 'Size', render: (d) => formatBytes(d.size) },
    { key: 'type', label: 'Type' },
    { key: 'visibility', label: 'Visibility', render: (d) => <Badge>{d.visibility}</Badge> },
    { key: 'date', label: 'Date', render: (d) => formatDate(d.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (d) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(d)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý tài liệu</h1>
      <Input placeholder="Tìm kiếm..." className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Xóa tài liệu"
        message="Tài liệu sẽ bị xóa mềm"
        onConfirm={() => deleteDoc.mutate(deleteTarget?.id)}
      />
    </div>
  )
}
