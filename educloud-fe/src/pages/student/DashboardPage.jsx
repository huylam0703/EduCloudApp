// src/pages/student/DashboardPage.jsx
import { FileText, Cloud, Upload, Download } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore, getDisplayName } from '@/store/authStore'
import { useMyDocuments } from '@/hooks/useDocuments'
import { useMyStorage } from '@/hooks/useStorage'
import { documentApi } from '@/api/documentApi'
import StatsCard from '@/components/admin/StatsCard'
import StorageBar from '@/components/common/StorageBar'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate, formatGreetingDate } from '@/utils/formatDate'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import UploadModal from '@/components/modals/UploadModal'
import CreateFolderModal from '@/components/modals/CreateFolderModal'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)

  const { data: storage, isLoading: storageLoading } = useMyStorage()
  const { data: docs, isLoading: docsLoading } = useMyDocuments()

  const used  = storage?.usedBytes  ?? 0
  const total = storage?.limitBytes ?? 5 * 1024 * 1024 * 1024
const pctRaw = total > 0 ? (used / total) * 100 : 0
const pct = pctRaw < 1 && pctRaw > 0 ? parseFloat(pctRaw.toFixed(2)) : Math.round(pctRaw)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const uploadsThisMonth = (docs ?? []).filter(
    (d) => d.createdAt && new Date(d.createdAt) >= startOfMonth
  ).length
  const totalDownloads = (docs ?? []).reduce(
    (sum, d) => sum + (d.downloadCount ?? 0), 0
  )

  if (storageLoading || docsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Xin chào, {getDisplayName(user)} 👋
        </h1>
        <p className="text-slate-500">{formatGreetingDate()}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Tài liệu của tôi"     value={docs?.length ?? 0}                            subtitle="files" icon={FileText} accent="indigo" />
        <StatsCard title="Dung lượng đã dùng"   value={`${formatBytes(used)} / ${formatBytes(total)}`} subtitle={`${pct}%`} icon={Cloud} accent="sky" />
        <StatsCard title="Đã upload tháng này"  value={uploadsThisMonth}                              subtitle="files" icon={Upload}   accent="emerald" />
        <StatsCard title="Lượt tải tài liệu"    value={totalDownloads}                                subtitle="lượt"  icon={Download} accent="amber" />
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Dung lượng lưu trữ</h2>
        <StorageBar used={used} total={total} />
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Tài liệu gần đây</h2>
        <div className="divide-y">
          {(docs ?? []).slice(0, 5).map((doc) => {
            const { Icon, color } = getFileTypeConfig(doc.fileType)
            return (
              <div key={doc.id} className="flex items-center gap-4 py-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="flex-1 truncate font-medium">{doc.documentName}</span>
                <span className="text-sm text-slate-500">{formatBytes(doc.fileSize)}</span>
                <span className="text-sm text-slate-500">{formatDate(doc.createdAt)}</span>
                <Button size="sm" variant="outline"
                  onClick={() => documentApi.handleDownload(doc)}>
                  Tải
                </Button>
              </div>
            )
          })}
          {(docs ?? []).length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              Chưa có tài liệu nào
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button onClick={() => setUploadOpen(true)}>⬆️ Upload tài liệu</Button>
        <Button variant="outline" onClick={() => setFolderOpen(true)}>📁 Tạo thư mục</Button>
      </div>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateFolderModal open={folderOpen} onOpenChange={setFolderOpen} />
    </div>
  )
}