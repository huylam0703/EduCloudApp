import { useEffect, useState } from 'react'
import { ChevronRight, Folder, FolderOpen, Loader2 } from 'lucide-react'
import { useDocumentActions } from '@/hooks/useDocuments'
import { useTreeFolders } from '@/hooks/useFolders'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function collectParentIds(folders, ids = []) {
  for (const folder of folders) {
    if (folder.children?.length > 0) {
      ids.push(folder.id)
      collectParentIds(folder.children, ids)
    }
  }
  return ids
}

function FolderTreeNode({
  folder,
  depth = 0,
  selectedId,
  expandedIds,
  onSelect,
  onToggleExpand,
}) {
  const hasChildren = folder.children?.length > 0
  const isSelected = selectedId === folder.id
  const isExpanded = expandedIds.has(folder.id)

  return (
    <div className={cn('space-y-1', depth > 0 && 'ml-1')}>
      <div
        className={cn(
          'flex items-center gap-1 rounded-lg transition-all',
          hasChildren
            ? 'border border-indigo-200 bg-indigo-50/90 shadow-sm'
            : 'border border-transparent',
          isSelected && 'border-indigo-400 ring-2 ring-indigo-200/60'
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            onClick={() => onToggleExpand(folder.id)}
            className="flex h-10 w-8 shrink-0 items-center justify-center rounded-l-lg text-indigo-600 hover:bg-indigo-100/80"
          >
            <ChevronRight
              className={cn('h-4 w-4 transition-transform duration-200', isExpanded && 'rotate-90')}
              strokeWidth={2.5}
            />
          </button>
        ) : (
          <span className="w-8 shrink-0" aria-hidden />
        )}

        <button
          type="button"
          onClick={() => onSelect(folder.id)}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2 py-2.5 pr-3 text-left text-sm transition-colors',
            hasChildren
              ? 'font-semibold text-indigo-950 hover:text-indigo-800'
              : 'text-slate-700 hover:bg-slate-50',
            isSelected && 'text-indigo-800',
            !hasChildren && 'rounded-lg pl-1'
          )}
        >
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-indigo-600" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-indigo-600" />
            )
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <span className="flex-1 truncate">{folder.folderName}</span>
          {hasChildren && (
            <span className="shrink-0 rounded-full bg-indigo-200/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-700">
              {folder.children.length} con
            </span>
          )}
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="relative ml-3 space-y-1 pl-4">
          <div className="absolute bottom-2 left-0 top-0 w-px bg-indigo-200" />
          {folder.children.map((child) => (
            <div key={child.id} className="relative pl-1">
              <div
                className="absolute -left-4 top-5 h-px w-4 bg-indigo-200"
                aria-hidden
              />
              <FolderTreeNode
                folder={child}
                depth={depth + 1}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onToggleExpand={onToggleExpand}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FolderTreeList({ folders, selectedId, expandedIds, onSelect, onToggleExpand }) {
  if (!folders?.length) return null

  return (
    <div className="space-y-2 p-2">
      {folders.map((folder) => (
        <FolderTreeNode
          key={folder.id}
          folder={folder}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  )
}

export default function MoveDocumentModal({ open, onOpenChange, doc, onSuccess }) {
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [expandedIds, setExpandedIds] = useState(new Set())
  const { handleMoveDocument, isMoving } = useDocumentActions()
  const { data: treeFolders = [], isLoading, isError } = useTreeFolders(open)

  useEffect(() => {
    if (!open) {
      setSelectedFolderId('')
      setExpandedIds(new Set())
    }
  }, [open])

  useEffect(() => {
    if (treeFolders.length > 0) {
      setExpandedIds(new Set(collectParentIds(treeFolders)))
    }
  }, [treeFolders])

  const toggleExpand = (folderId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedIds(new Set(collectParentIds(treeFolders)))
  }

  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  const currentFolderId = doc?.folderId ?? null
  const canSubmit =
    selectedFolderId &&
    selectedFolderId !== currentFolderId &&
    !isMoving

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!doc || !canSubmit) return

    try {
      await handleMoveDocument(doc.id, selectedFolderId)
      onOpenChange(false)
      onSuccess?.()
    } catch {
      /* toast handled in hook */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chuyển tài liệu</DialogTitle>
          <DialogDescription>
            Chọn thư mục đích cho &quot;{doc?.documentName ?? doc?.name}&quot;
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Thư mục đích</Label>
              {!isLoading && treeFolders.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={expandAll}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Mở tất cả
                  </button>
                  <span className="text-xs text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={collapseAll}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Thu gọn tất cả
                  </button>
                </div>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/30">
              {isLoading ? (
                <div className="space-y-2 p-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-3/4" />
                </div>
              ) : isError ? (
                <p className="p-3 text-sm text-red-600">
                  Không thể tải danh sách thư mục
                </p>
              ) : treeFolders.length === 0 ? (
                <p className="p-3 text-sm text-slate-500">
                  Chưa có thư mục. Hãy tạo thư mục trước.
                </p>
              ) : (
                <FolderTreeList
                  folders={treeFolders}
                  selectedId={selectedFolderId}
                  expandedIds={expandedIds}
                  onSelect={setSelectedFolderId}
                  onToggleExpand={toggleExpand}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isMoving}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isMoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Chuyển
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
