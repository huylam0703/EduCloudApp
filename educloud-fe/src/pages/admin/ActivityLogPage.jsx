import { useQuery } from '@tanstack/react-query'
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
  const { data: logs, isLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: adminService.getActivityLogs,
  })

  const columns = [
    { key: 'user', label: 'User' },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${actionColors[r.action] || 'bg-slate-100'}`}>
          {r.action}
        </span>
      ),
    },
    { key: 'entity', label: 'Entity' },
    { key: 'detail', label: 'Detail' },
    { key: 'ip', label: 'IP' },
    { key: 'time', label: 'Time', render: (r) => formatDate(r.time, 'dd/MM/yyyy HH:mm') },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Activity Log</h1>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Tìm user..." className="max-w-xs" />
        <Input type="date" className="w-[160px]" />
        <Input type="date" className="w-[160px]" />
      </div>
      <DataTable columns={columns} data={logs} isLoading={isLoading} />
    </div>
  )
}
