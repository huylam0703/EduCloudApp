import axiosClient from '@/lib/apiClient.js'
import {documentService} from "@/services/documentService.js";

export const documentApi = {
    getMyDocuments: () => axiosClient.get('/document/MyDocument'),
    preview: (documentId) =>
        axiosClient.get(`/document/preview/${documentId}`, { responseType: 'blob' }),

    upload: (formData, onUploadProgress) =>
        axiosClient.post('/document/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (!e.total) return
                const percent = Math.round((e.loaded * 100) / e.total)
                onUploadProgress?.(percent)
            },
        }),

    handleDownload: async (doc) => {
        try {
            const blob = await documentService.downloadDocument(doc.id)

            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = doc.documentName

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }
}