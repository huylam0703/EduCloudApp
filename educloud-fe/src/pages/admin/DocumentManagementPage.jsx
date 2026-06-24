import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, Trash2 } from 'lucide-react'
import { documentApi } from '@/api/documentApi'
import DataTable from '@/components/admin/DataTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PreviewModal from '@/components/modals/PreviewModal'
import { useDeleteDocument } from '@/hooks/useDocuments'

export default function DocumentManagementPage() {
  const [search, setSearch] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const deleteDoc = useDeleteDocument()

  const { data: docs, isLoading } = useQuery({
    queryKey: ['adminDocuments', pageNo, pageSize],
    queryFn: () => documentApi.getPublicDocuments({ pageNo, pageSize }),
    keepPreviousData: true,
  })

  const content = docs?.content ?? []
  const filtered = content.filter((d) => !search || d.documentName.toLowerCase().includes(search.toLowerCase()))

  const columns = [
    { key: 'documentName', label: 'Tên tài liệu' },
    { key: 'uploadedByName', label: 'Người tải lên' },
    { key: 'majorName', label: 'Chuyên ngành' },
    { key: 'subjectName', label: 'Môn học' },
    { key: 'fileType', label: 'Loại file' },
    { key: 'fileSize', label: 'Kích thước', render: (d) => formatBytes(d.fileSize ?? 0) },
    { key: 'visibility', label: 'Quyền truy cập', render: (d) => <Badge>{d.visibility}</Badge> },
    { key: 'downloadCount', label: 'Lượt tải' },
    { key: 'createdAt', label: 'Ngày tạo', render: (d) => formatDate(d.createdAt) },
    {
      key: 'actions',
      label: 'Hành động',
      render: (d) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(d)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(d)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const isLastPage = docs?.last ?? true

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý tài liệu</h1>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input placeholder="Tìm kiếm..." className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Trang {docs?.pageNo ?? pageNo} / {docs?.totalPages ?? 1}</span>
          <Button variant="outline" size="sm" disabled={pageNo <= 1} onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}>
            Trước
          </Button>
          <Button variant="outline" size="sm" disabled={isLastPage} onClick={() => setPageNo((prev) => prev + 1)}>
            Sau
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-500">
        <span>{filtered.length === 0 ? 'Không có dữ liệu' : `Hiển thị ${filtered.length} trên ${docs?.totalElements ?? 0} tài liệu`}</span>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Xóa tài liệu"
        message="Tài liệu sẽ bị xóa mềm"
        onConfirm={() => {
          deleteDoc.mutate(deleteTarget?.id)
          setDeleteTarget(null)
        }}
      />

      <PreviewModal open={!!previewDoc} onOpenChange={(v) => !v && setPreviewDoc(null)} doc={previewDoc} />
    </div>
  )
}
