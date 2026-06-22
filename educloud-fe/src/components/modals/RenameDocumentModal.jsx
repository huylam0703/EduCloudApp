import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useDocumentActions } from '@/hooks/useDocuments'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function getDocumentName(doc) {
  return doc?.documentName ?? doc?.name ?? ''
}

export default function RenameDocumentModal({ open, onOpenChange, doc, onSuccess }) {
  const [name, setName] = useState('')
  const { handleRenameDocument, isRenaming } = useDocumentActions()

  useEffect(() => {
    if (open && doc) {
      setName(getDocumentName(doc))
    }
  }, [open, doc])

  const trimmed = name.trim()
  const originalName = getDocumentName(doc).trim()
  const canSubmit = trimmed && trimmed !== originalName && !isRenaming

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!doc || !canSubmit) return

    try {
      await handleRenameDocument(doc.id, trimmed)
      onOpenChange(false)
      onSuccess?.()
    } catch {
      /* toast handled in hook */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Đổi tên tài liệu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Tên mới</Label>
            <Input
              id="documentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tài liệu..."
              autoFocus
              disabled={isRenaming}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRenaming}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isRenaming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
