import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Cloud, Database, HardDrive, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cloudStorageProviderService } from '@/services/cloudStorageProviderService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBytes } from '@/utils/formatBytes'
import { formatDate } from '@/utils/formatDate'

function InfoField({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</p>
    </div>
  )
}

export default function CloudStoragePage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ endpointUrl: '', bucketName: '' })

  const { data: storageInfo, isLoading, isError, error } = useQuery({
    queryKey: ['cloud-storage-info'],
    queryFn: cloudStorageProviderService.getCloudStorageInfo,
    retry: false,
  })

  const isNotFound = isError && error?.response?.status === 404
  const hasProvider = Boolean(storageInfo) && !isNotFound

  const createMutation = useMutation({
    mutationFn: cloudStorageProviderService.createProvider,
    onSuccess: () => {
      toast.success('Tạo Cloud Storage Provider thành công')
      queryClient.invalidateQueries({ queryKey: ['cloud-storage-info'] })
      setForm({ endpointUrl: '', bucketName: '' })
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || 'Tạo Cloud Storage Provider thất bại'
      )
    },
  })

  const canSubmit =
    form.endpointUrl.trim() && form.bucketName.trim() && !createMutation.isPending

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    createMutation.mutate({
      endpointUrl: form.endpointUrl.trim(),
      bucketName: form.bucketName.trim(),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cloud Storage</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý cấu hình AWS S3 và theo dõi dung lượng lưu trữ hệ thống.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Thông tin lưu trữ
            </CardTitle>
            <CardDescription>
              Thông tin provider AWS S3 hiện tại và dung lượng đã sử dụng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : isNotFound || !hasProvider ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                <Cloud className="h-10 w-10 text-slate-300" />
                <p className="mt-4 text-sm text-slate-500">
                  Chưa có Cloud Storage Provider. Vui lòng tạo provider trước.
                </p>
              </div>
            ) : isError ? (
              <p className="text-sm text-red-600">
                Không thể tải thông tin lưu trữ. Vui lòng thử lại sau.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{storageInfo.providerName}</span>
                  </div>
                  <Badge
                    variant={storageInfo.status === 'ACTIVE' ? 'success' : 'secondary'}
                  >
                    {storageInfo.status}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoField label="Endpoint URL" value={storageInfo.endpointUrl} />
                  <InfoField label="Bucket" value={storageInfo.bucketName} />
                  <InfoField
                    label="Tổng số file"
                    value={storageInfo.totalFiles?.toLocaleString()}
                  />
                  <InfoField
                    label="Dung lượng đã dùng"
                    value={
                      storageInfo.usedSize ||
                      formatBytes(storageInfo.usedBytes)
                    }
                  />
                  <InfoField
                    label="Dung lượng (bytes)"
                    value={storageInfo.usedBytes?.toLocaleString()}
                  />
                  <InfoField
                    label="Ngày tạo"
                    value={formatDate(storageInfo.createdAt, 'dd/MM/yyyy HH:mm')}
                  />
                  <InfoField
                    label="Kiểm tra lần cuối"
                    value={formatDate(storageInfo.checkedAt, 'dd/MM/yyyy HH:mm')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Tạo Cloud Storage Provider
            </CardTitle>
            <CardDescription>
              Cấu hình AWS S3 provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasProvider ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Provider đã được cấu hình</p>
                <p className="mt-2">
                  Hệ thống chỉ hỗ trợ một provider AWS S3. Xem thông tin tại card bên trái.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="endpointUrl">Endpoint URL</Label>
                  <Input
                    id="endpointUrl"
                    placeholder="s3.ap-southeast-1.amazonaws.com"
                    value={form.endpointUrl}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endpointUrl: e.target.value }))
                    }
                    disabled={createMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bucketName">Bucket Name</Label>
                  <Input
                    id="bucketName"
                    placeholder="educloud-docs"
                    value={form.bucketName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, bucketName: e.target.value }))
                    }
                    disabled={createMutation.isPending}
                  />
                </div>

                <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo Provider'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
