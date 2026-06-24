import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { adminService } from '@/services/adminService'
import DataTable from '@/components/admin/DataTable'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/utils/formatDate'

const actionColors = {
  UPLOAD_DOCUMENT: 'bg-blue-100 text-blue-700',
  DOWNLOAD_DOCUMENT: 'bg-emerald-100 text-emerald-700',
  DELETE_DOCUMENT: 'bg-red-100 text-red-700',
  CREATE_FOLDER: 'bg-amber-100 text-amber-700',
}

export default function ActivityLogPage() {
  const [pageNo, setPageNo] = useState(1)
  const pageSize = 10

  const { data: logs, isLoading } = useQuery({
    queryKey: ['activityLogs', pageNo, pageSize],
    queryFn: () => adminService.getActivityLogs({ pageNo, pageSize }),
    keepPreviousData: true,
  })

  const columns = [
    { key: 'username', label: 'User' },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${actionColors[r.action] || 'bg-slate-100'}`}>
          {r.action}
        </span>
      ),
    },
    { key: 'entityType', label: 'Entity Type' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Time', render: (r) => formatDate(r.createdAt, 'dd/MM/yyyy HH:mm') },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Activity Log</h1>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Tìm user..." className="max-w-xs" />
        <Input type="date" className="w-[160px]" />
        <Input type="date" className="w-[160px]" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Trang {pageNo} / {logs?.totalPages ?? 1}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={pageNo <= 1} onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}>
            Trước
          </Button>
          <Button variant="outline" size="sm" disabled={logs?.last ?? true} onClick={() => setPageNo((prev) => prev + 1)}>
            Sau
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={logs?.content ?? []} isLoading={isLoading} />
    </div>
  )
}
