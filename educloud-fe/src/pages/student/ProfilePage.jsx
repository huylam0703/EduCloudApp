import { useAuthStore, getDisplayName, isAdmin } from '@/store/authStore'
import { useDashboardStats } from '@/hooks/useDocuments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatBytes } from '@/utils/formatBytes'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isLoading } = useDashboardStats()
  const used = stats?.storageUsed || 0
  const total = stats?.storageQuota || 5368709120
  const pct = Math.round((used / total) * 100)

  if (!user) return <Skeleton className="h-64" />

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="flex flex-col items-center p-8">
          <div className="group relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary text-white">
                {getDisplayName(user).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-white">Đổi ảnh</span>
            </div>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{getDisplayName(user)}</h2>
          <p className="text-slate-500">{user.email}</p>
          <Badge className="mt-2">{isAdmin(user) ? 'Admin' : 'Student'}</Badge>
          <form className="mt-6 w-full space-y-4">
            <div>
              <Label>Họ tên</Label>
              <Input className="mt-1" defaultValue={getDisplayName(user)} />
            </div>
            <Button type="button">Lưu thay đổi</Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dung lượng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <>
                <div
                  className="relative flex h-32 w-32 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#4F46E5 ${pct}%, #e2e8f0 0)`,
                  }}
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-lg font-bold">
                    {pct}%
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600">
                  {formatBytes(used)} đã dùng / {formatBytes(total)}
                </p>
                <p className="text-sm text-slate-500">{stats?.documentCount ?? 0} files</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Đã upload: {stats?.documentCount ?? 0} files</p>
            <p>Đã tải: {stats?.totalDownloads ?? 0} lượt</p>
            <p>Tham gia: —</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
