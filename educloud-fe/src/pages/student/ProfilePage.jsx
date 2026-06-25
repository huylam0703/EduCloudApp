import { useState } from 'react'
import { useAuthStore, getDisplayName, isAdmin } from '@/store/authStore'
import { useMyStorage } from '@/hooks/useStorage'
import { useMyDocuments } from '@/hooks/useDocuments'
import { userService } from '@/services/userService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatBytes } from '@/utils/formatBytes'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const { data: storage, isLoading: storageLoading } = useMyStorage()
  const { data: docs, isLoading: docsLoading } = useMyDocuments()

  const used  = storage?.usedBytes  ?? 0
  const total = storage?.limitBytes ?? 5 * 1024 * 1024 * 1024
  const pctRaw = total > 0 ? (used / total) * 100 : 0
const pct = pctRaw < 1 && pctRaw > 0 ? parseFloat(pctRaw.toFixed(2)) : Math.round(pctRaw)
  const fileCount = docs?.length ?? 0

  const [firstName, setFirstName]       = useState(user?.firstName || '')
  const [lastName, setLastName]         = useState(user?.lastName || '')
  const [email, setEmail]               = useState(user?.email || '')
  const [dob, setDob]                   = useState(user?.dob || '')
  const [phoneNumber, setPhoneNumber]   = useState(user?.phoneNumber || '')
  const [saving, setSaving]             = useState(false)

  if (!user) return <Skeleton className="h-64" />

  const handleUpdate = async () => {
    try {
      setSaving(true)
      const payload = {
        firstName,
        lastName,
        email,
        dob,
        phoneNumber,
        roles: user.roles?.map((r) => r.name || r),
      }
      const res = await userService.updateUser(user.id, payload)
      setUser(res.result ?? res)
      toast.success('Cập nhật thông tin thành công')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Thông tin cá nhân ── */}
      <Card>
        <CardContent className="flex flex-col items-center p-8">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-primary text-white">
              {getDisplayName(user).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="mt-4 text-xl font-semibold">{getDisplayName(user)}</h2>
          <p className="text-slate-500">{user.email}</p>
          <Badge className="mt-2">{isAdmin(user) ? 'Admin' : 'Student'}</Badge>

          <div className="mt-6 w-full space-y-4">
            <div>
              <Label>Họ</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Label>Tên</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Ngày sinh</Label>
              <Input type="date" value={dob || ''} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <Button type="button" onClick={handleUpdate} disabled={saving} className="w-full">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Dung lượng ── */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dung lượng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {storageLoading || docsLoading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <>
                <div
                  className="relative flex h-32 w-32 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#4F46E5 ${Math.max(pctRaw, 0.5)}%, #e2e8f0 0)`,
                  }}
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-lg font-bold">
                    {pct < 1 && pct > 0 ? `<1` : pct}%
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600">
                  {formatBytes(used)} đã dùng / {formatBytes(total)}
                </p>
               
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}