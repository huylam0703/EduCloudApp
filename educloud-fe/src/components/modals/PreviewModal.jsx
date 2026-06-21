// src/components/modals/PreviewModal.jsx
import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { documentApi } from '@/api/documentApi'
import {documentService} from "@/services/documentService.js";

function getPreviewKind(fileType, mimeType) {
    const type = (fileType || '').toUpperCase()
    if (type === 'PDF') return 'pdf'
    if (type === 'IMAGE' || mimeType?.startsWith('image/')) return 'image'
    if (type === 'TXT' || mimeType === 'text/plain') return 'text'
    if (type === 'VIDEO' || mimeType?.startsWith('video/')) return 'video'
    if (type === 'AUDIO' || mimeType?.startsWith('audio/')) return 'audio'
    return 'unsupported' // DOCX / XLSX / PPTX...
}

export default function PreviewModal({ open, onOpenChange, doc }) {
    const [blobUrl, setBlobUrl] = useState(null)
    const [textContent, setTextContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const kind = doc ? getPreviewKind(doc.fileType, doc.mimeType) : 'unsupported'

    useEffect(() => {
        if (!open || !doc || kind === 'unsupported') return

        let objectUrl = null
        setLoading(true)
        setError(null)

        documentApi
            .preview(doc.id)
            .then((res) => {
                const blob = res.data
                if (kind === 'text') {
                    return blob.text().then(setTextContent)
                }
                objectUrl = URL.createObjectURL(blob)
                setBlobUrl(objectUrl)
            })
            .catch(() => setError('Không thể tải xem trước tài liệu.'))
            .finally(() => setLoading(false))

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
            setBlobUrl(null)
            setTextContent('')
        }
    }, [open, doc?.id, kind])

    if (!doc) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="truncate pr-8">{doc.documentName}</DialogTitle>
                </DialogHeader>

                <div className="flex max-h-[65vh] min-h-[300px] items-center justify-center overflow-auto rounded-lg bg-slate-50">
                    {kind === 'unsupported' ? (
                        <div className="flex flex-col items-center gap-3 p-8 text-center">
                            <p className="text-slate-600">Không hỗ trợ xem trước, vui lòng tải xuống</p>
                            <Button onClick={() => documentApi.handleDownload(doc)}>
                                <Download className="mr-2 h-4 w-4" /> Tải xuống
                            </Button>
                        </div>
                    ) : loading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    ) : error ? (
                        <div className="flex flex-col items-center gap-3 p-8 text-center">
                            <p className="text-red-500">{error}</p>
                            <Button variant="outline" onClick={() => documentApi.handleDownload(doc)}>
                                <Download className="mr-2 h-4 w-4" /> Tải xuống
                            </Button>
                        </div>
                    ) : kind === 'pdf' ? (
                        <iframe src={blobUrl} title={doc.documentName} className="h-[65vh] w-full" />
                    ) : kind === 'image' ? (
                        <img src={blobUrl} alt={doc.documentName} className="max-h-[65vh] object-contain" />
                    ) : kind === 'video' ? (
                        <video src={blobUrl} controls className="max-h-[65vh] w-full" />
                    ) : kind === 'audio' ? (
                        <audio src={blobUrl} controls className="w-full" />
                    ) : kind === 'text' ? (
                        <pre className="w-full whitespace-pre-wrap p-4 text-sm">{textContent}</pre>
                    ) : null}
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => documentApi.handleDownload(doc)}>
                        <Download className="mr-2 h-4 w-4" /> Tải xuống bản gốc
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}