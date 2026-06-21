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
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUiStore } from '@/store/uiStore'
import { useChangeDocumentVisibility, useDeleteDocument } from '@/hooks/useDocuments'

export default function FolderViewPage() {
    const { folderId } = useParams()
    const navigate = useNavigate()
    const { data, isLoading } = useFolders(folderId)
    const { data: breadcrumb = [] } = useBreadcrumb(folderId)
    const { viewMode, setViewMode } = useUiStore()
    const [folderOpen, setFolderOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const [previewDoc, setPreviewDoc] = useState(null)
    const [pendingAction, setPendingAction] = useState(null) // { type: 'delete' | 'visibility', doc }

    const folders = data?.folders || []
    const files = data?.files || []

    const changeVisibility = useChangeDocumentVisibility()
    const deleteDoc = useDeleteDocument()

    const closeDialog = () => setPendingAction(null)

    const handleConfirm = () => {
        if (!pendingAction) return
        const { type, doc } = pendingAction
        if (type === 'delete') {
            deleteDoc.mutate(doc.id, { onSuccess: closeDialog })
        } else {
            changeVisibility.mutate(doc.id, { onSuccess: closeDialog })
        }
    }

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
                                    <FileCard
                                        key={doc.id}
                                        doc={doc}
                                        onPreview={setPreviewDoc}
                                        onToggleVisibility={(d) => setPendingAction({ type: 'visibility', doc: d })}
                                        onDelete={(d) => setPendingAction({ type: 'delete', doc: d })}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            <CreateFolderModal open={folderOpen} onOpenChange={setFolderOpen} parentId={folderId || null} />
            <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} folderId={folderId || null} />
            <PreviewModal open={!!previewDoc} onOpenChange={(v) => !v && setPreviewDoc(null)} doc={previewDoc} />

            <ConfirmDialog
                open={!!pendingAction}
                onOpenChange={(v) => !v && closeDialog()}
                title={pendingAction?.type === 'delete' ? 'Xóa tài liệu?' : 'Đổi visibility?'}
                description={
                    pendingAction?.type === 'delete'
                        ? `Tài liệu "${pendingAction?.doc?.documentName}" sẽ bị xóa vĩnh viễn.`
                        : `Chuyển "${pendingAction?.doc?.documentName}" sang ${pendingAction?.doc?.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'}?`
                }
                confirmText={pendingAction?.type === 'delete' ? 'Xóa' : 'Xác nhận'}
                variant={pendingAction?.type === 'delete' ? 'destructive' : 'default'}
                loading={deleteDoc.isPending || changeVisibility.isPending}
                onConfirm={handleConfirm}
            />
        </div>
    )
}