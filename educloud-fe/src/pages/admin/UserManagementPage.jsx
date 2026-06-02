import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, Lock, Unlock } from 'lucide-react'
import { adminService } from '@/services/adminService'
import DataTable from '@/components/admin/DataTable'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatBytes } from '@/utils/formatBytes'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function UserManagementPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getAllUsers,
  })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmUser, setConfirmUser] = useState(null)

  const filtered = useMemo(() => {
    return (users || []).filter((u) => {
      const name = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase()
      if (search && !name.includes(search.toLowerCase())) return false
      if (roleFilter && !u.roles?.some((r) => r.name === roleFilter)) return false
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [users, search, roleFilter, statusFilter])

  const columns = [
    {
      key: 'name',
      label: 'Avatar+Name',
      render: (u) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{u.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <span>{u.firstName} {u.lastName}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (u) => <Badge>{u.roles?.[0]?.name || 'USER'}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'destructive'}>{u.status}</Badge>
      ),
    },
    {
      key: 'storage',
      label: 'Storage',
      render: (u) => formatBytes(u.storageUsed || 0),
    },
    { key: 'createdAt', label: 'Created', render: (u) => u.createdAt?.slice(0, 10) },
    {
      key: 'actions',
      label: 'Actions',
      render: (u) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setConfirmUser(u)}>
            {u.status === 'ACTIVE' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Tìm tên/email..." className="max-w-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select onValueChange={(v) => setRoleFilter(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setStatusFilter(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="BLOCKED">BLOCKED</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
      <ConfirmDialog
        open={!!confirmUser}
        onOpenChange={() => setConfirmUser(null)}
        title={confirmUser?.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        message={`Xác nhận thao tác với ${confirmUser?.username}?`}
        onConfirm={() => {}}
      />
    </div>
  )
}
