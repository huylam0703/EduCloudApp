import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FolderOpen, LayoutGrid, List } from 'lucide-react'
import { useFolders } from '@/hooks/useFolders'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import FolderCard from '@/components/common/FolderCard'
import FileCard from '@/components/common/FileCard'
import EmptyState from '@/components/common/EmptyState'
import CreateFolderModal from '@/components/modals/CreateFolderModal'
import UploadModal from '@/components/modals/UploadModal'
import PreviewModal from '@/components/modals/PreviewModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUiStore } from '@/store/uiStore'

export default function FolderViewPage() {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useFolders(folderId)
  const { data: breadcrumb = [] } = useBreadcrumb(folderId)
  const { viewMode, setViewMode } = useUiStore()
  const [folderOpen, setFolderOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)

  const folders = data?.folders || []
  const files = data?.files || []

  return (
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <Link to="/folders" className="hover:text-primary">Thư mục gốc</Link>
          {breadcrumb.map((b) => (
              <span key={b.id} className="flex items-center gap-1">
            <span>/</span>
            <Link to={`/folders/${b.id}`} className="hover:text-primary">{b.name}</Link>
          </span>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setFolderOpen(true)}>📁 Tạo thư mục</Button>
          <Button variant="outline" onClick={() => setUploadOpen(true)}>⬆️ Upload vào đây</Button>
          <div className="ml-auto flex gap-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
            <Skeleton className="h-32" />
        ) : !folders.length && !files.length ? (
            <EmptyState icon={FolderOpen} title="Thư mục trống" description="Hãy tạo thư mục con hoặc upload tài liệu." />
        ) : (
            <>
              {folders.length > 0 && (
                  <section>
                    <h2 className="mb-3 font-semibold">Thư mục</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {folders.map((f) => (
                          <FolderCard key={f.id} folder={f} onOpen={() => navigate(`/folders/${f.id}`)} />
                      ))}
                    </div>
                  </section>
              )}
              {files.length > 0 && (
                  <section>
                    <h2 className="mb-3 font-semibold">Tài liệu</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {files.map((doc) => (
                          <FileCard key={doc.id} doc={doc} onPreview={setPreviewDoc} />
                      ))}
                    </div>
                  </section>
              )}
            </>
        )}

        <CreateFolderModal open={folderOpen} onOpenChange={setFolderOpen} parentId={folderId || null} />
        <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} folderId={folderId || null} />
        <PreviewModal open={!!previewDoc} onOpenChange={(v) => !v && setPreviewDoc(null)} doc={previewDoc} />
      </div>
  )
}