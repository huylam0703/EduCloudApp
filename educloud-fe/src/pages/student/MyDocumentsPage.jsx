import { useState, useMemo } from 'react'
import { CloudUpload, LayoutGrid, List, Plus } from 'lucide-react'
import { useMyDocuments, useDeleteDocument } from '@/hooks/useDocuments'
import { useUiStore } from '@/store/uiStore'
import FileCard from '@/components/common/FileCard'
import FileRow from '@/components/common/FileRow'
import EmptyState from '@/components/common/EmptyState'
import UploadModal from '@/components/modals/UploadModal'
import DocumentDetailModal from '@/components/modals/DocumentDetailModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
export default function MyDocumentsPage() {
  const { data: docs, isLoading } = useMyDocuments()
  const deleteDoc = useDeleteDocument()
  const { viewMode, setViewMode } = useUiStore()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    let list = [...(docs || [])]
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'size') list.sort((a, b) => b.size - a.size)
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  }, [docs, search, sort])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tài liệu của tôi</h1>
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Tìm theo tên..." className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select onValueChange={setSort} defaultValue="newest">
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="name">Tên A-Z</SelectItem>
            <SelectItem value="size">Dung lượng</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-1">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!filtered.length ? (
        <EmptyState
          icon={CloudUpload}
          title="Chưa có tài liệu nào"
          description="Hãy upload tài liệu đầu tiên!"
          action={<Button onClick={() => setUploadOpen(true)}>Upload ngay</Button>}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((doc) => (
            <FileCard
              key={doc.id}
              doc={doc}
              onView={setSelected}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <FileRow key={doc.id} doc={doc} onView={setSelected} onDelete={setDeleteTarget} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon" onClick={() => setUploadOpen(true)}>
        <Plus className="h-6 w-6" />
      </Button>
      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
      <DocumentDetailModal doc={selected} open={!!selected} onOpenChange={() => setSelected(null)} isOwner onDelete={setDeleteTarget} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Xóa tài liệu"
        message="Tài liệu sẽ bị xóa mềm. Bạn có chắc?"
        onConfirm={() => deleteDoc.mutate(deleteTarget?.id)}
      />
    </div>
  )
}
