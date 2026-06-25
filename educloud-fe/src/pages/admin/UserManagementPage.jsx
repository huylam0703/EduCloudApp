import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import axiosClient from '@/lib/apiClient.js'
import DataTable from '@/components/admin/DataTable'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatBytes } from '@/utils/formatBytes'
import ConfirmDialog from '@/components/common/ConfirmDialog'

async function fetchAllUsers() {
  const { data } = await axiosClient.get('/users', { params: { pageNo: 1, pageSize: 500 } })
  const result = data?.result
  if (result && Array.isArray(result.content)) return result.content
  if (Array.isArray(result)) return result
  return []
}

async function deleteUser(userId) {
  const { data } = await axiosClient.delete(`/users/${userId}`)
  return data
}

export default function UserManagementPage() {
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
  })

  const [search, setSearch] = useState('')
  const [confirmUser, setConfirmUser] = useState(null)

  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      toast.success('Đã xoá người dùng')
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      setConfirmUser(null)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Xoá người dùng thất bại')
      setConfirmUser(null)
    },
  })

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const name = `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''} ${u.username ?? ''}`.toLowerCase()
      if (search && !name.includes(search.toLowerCase())) return false
      return true
    })
  }, [users, search])

  const columns = [
    {
      key: 'name',
      label: 'Người dùng',
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {(u.firstName?.[0] || u.username?.[0] || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">
              {[u.firstName, u.lastName].filter(Boolean).join(' ') || u.username}
            </p>
            <p className="text-xs text-slate-500">{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (u) => u.email || <span className="text-slate-400">—</span>,
    },
    {
      key: 'dob',
      label: 'Ngày sinh',
      render: (u) => u.dob ? <span>{u.dob}</span> : <span className="text-slate-400">—</span>,
    },
    {
      key: 'phoneNumber',
      label: 'SĐT',
      render: (u) => u.phoneNumber || <span className="text-slate-400">—</span>,
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (u) => {
        const roleName = u.roles?.[0]?.name || 'USER'
        return (
          <Badge variant={roleName === 'ADMIN' ? 'default' : 'secondary'}>
            {roleName}
          </Badge>
        )
      },
    },
    {
      key: 'storage',
      label: 'Dung lượng',
      render: (u) => formatBytes(u.storageUsedBytes || 0),
    },
    {
      key: 'actions',
      label: 'Hành động',
      render: (u) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setConfirmUser(u)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm tên / email / username..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={isLoading} />

      <ConfirmDialog
        open={!!confirmUser}
        onOpenChange={(v) => !v && setConfirmUser(null)}
        title="Xoá người dùng?"
        description={`Bạn có chắc muốn xoá tài khoản "${confirmUser?.username}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(confirmUser?.id)}
      />
    </div>
  )
}