import { FileText, Cloud, Upload, Download, FolderPlus } from 'lucide-react'
import { useAuthStore, getDisplayName } from '@/store/authStore'
import { useDashboardStats, useMyDocuments } from '@/hooks/useDocuments'
import StatsCard from '@/components/admin/StatsCard'
import StorageBar from '@/components/common/StorageBar'
import { formatBytes } from '@/utils/formatBytes'
import { formatGreetingDate } from '@/utils/formatDate'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import UploadModal from '@/components/modals/UploadModal'
import CreateFolderModal from '@/components/modals/CreateFolderModal'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatDate } from '@/utils/formatDate'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isLoading } = useDashboardStats()
  const { data: docs } = useMyDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)

  const used = stats?.storageUsed || 0
  const total = stats?.storageQuota || 5368709120
  const pct = Math.round((used / total) * 100)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
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
        <StatsCard title="Tài liệu của tôi" value={stats?.documentCount ?? 0} subtitle="files" icon={FileText} accent="indigo" />
        <StatsCard title="Dung lượng đã dùng" value={`${formatBytes(used)} / ${formatBytes(total)}`} subtitle={`${pct}%`} icon={Cloud} accent="sky" />
        <StatsCard title="Đã upload tháng này" value={stats?.uploadsThisMonth ?? 0} subtitle="files" icon={Upload} accent="emerald" />
        <StatsCard title="Lượt tải tài liệu" value={stats?.totalDownloads ?? 0} subtitle="lượt" icon={Download} accent="amber" />
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Dung lượng lưu trữ</h2>
        <StorageBar used={used} total={total} />
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Tài liệu gần đây</h2>
        <div className="divide-y">
          {(docs || []).slice(0, 5).map((doc) => {
            const { Icon, color } = getFileTypeConfig(doc.type)
            return (
              <div key={doc.id} className="flex items-center gap-4 py-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="flex-1 truncate font-medium">{doc.name}</span>
                <span className="text-sm text-slate-500">{formatBytes(doc.size)}</span>
                <span className="text-sm text-slate-500">{formatDate(doc.createdAt)}</span>
                <Button size="sm" variant="outline">Tải</Button>
              </div>
            )
          })}
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
