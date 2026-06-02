import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatBytes } from '@/utils/formatBytes'
import { Skeleton } from '@/components/ui/skeleton'
import { Cloud } from 'lucide-react'

export default function CloudStoragePage() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['storageProviders'],
    queryFn: adminService.getStorageProviders,
  })

  const totalUsed = (providers || []).reduce((s, p) => s + (p.usedBytes || 0), 0)
  const totalFiles = (providers || []).reduce((s, p) => s + (p.filesStored || 0), 0)

  if (isLoading) return <Skeleton className="h-64" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cloud Storage</h1>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {(providers || []).map((p) => (
          <Card key={p.id} className="min-w-[280px] shrink-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <Cloud className="h-8 w-8 text-primary" />
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'secondary'}>{p.status}</Badge>
              </div>
              <h3 className="mt-3 font-semibold">{p.name}</h3>
              <p className="mt-2 text-xs text-slate-500">{p.endpoint}</p>
              <p className="text-xs text-slate-500">Bucket: {p.bucket}</p>
              <p className="mt-3 text-sm font-medium">{p.filesStored?.toLocaleString()} files</p>
              <p className="text-sm text-slate-500">{formatBytes(p.usedBytes)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold">Tổng quan dung lượng</h2>
          <div className="mt-4 flex h-8 overflow-hidden rounded-lg">
            {(providers || []).map((p, i) => {
              const pct = totalUsed ? (p.usedBytes / totalUsed) * 100 : 0
              const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-slate-300']
              return (
                <div
                  key={p.id}
                  className={colors[i % colors.length]}
                  style={{ width: `${pct}%` }}
                  title={p.name}
                />
              )
            })}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Tổng: {formatBytes(totalUsed)} đã dùng · {totalFiles.toLocaleString()} files
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
