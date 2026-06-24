import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Cloud, Upload, Download, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { adminService } from '@/services/adminService'
import StatsCard from '@/components/admin/StatsCard'
import DataTable from '@/components/admin/DataTable'
import { formatDate } from '@/utils/formatDate'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981']

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminService.getDashboard,
  })
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: adminService.getActivityLogs,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28" />)}
      </div>
    )
  }

  const logColumns = [
    { key: 'user', label: 'User' },
    { key: 'action', label: 'Action', render: (r) => <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{r.action}</span> },
    { key: 'detail', label: 'Document' },
    { key: 'time', label: 'Time', render: (r) => formatDate(r.time, 'dd/MM/yyyy HH:mm') },
    { key: 'ip', label: 'IP' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Tổng người dùng"  value={stats?.totalUsers?.toLocaleString()}     icon={Users}     accent="indigo" />
        <StatsCard title="Tổng tài liệu"    value={stats?.totalDocuments?.toLocaleString()} icon={FileText}  accent="sky" />
        <StatsCard title="Tổng dung lượng"  value={stats?.totalStorageDisplay}              icon={Cloud}     accent="emerald" />
        <StatsCard title="Tổng số upload"      value={stats?.totalUploads}    subtitle="files" icon={Upload}    accent="amber" />
        <StatsCard title="Tổng lượt download"     value={stats?.totalDownloads}  subtitle="lượt"  icon={Download}  accent="indigo" />
        <StatsCard title="Tài liệu bị xóa"  value={stats?.deletedDocuments} subtitle="files" icon={Trash2}   accent="red" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Upload theo ngày (7 ngày)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.uploadLast7Days || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Phân bổ theo Major</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats?.majorDistribution || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {(stats?.majorDistribution || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h2 className="mb-4 font-semibold">Hoạt động gần đây</h2>
        <DataTable columns={logColumns} data={logs} isLoading={logsLoading} />
      </div>
    </div>
  )
}