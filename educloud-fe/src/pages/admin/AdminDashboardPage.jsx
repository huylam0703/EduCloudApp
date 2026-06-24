import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Cloud, Upload, Download, Trash2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { adminService } from '@/services/adminService'
import StatsCard from '@/components/admin/StatsCard'
import DataTable from '@/components/admin/DataTable'
import { formatDate } from '@/utils/formatDate'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444']

const LOG_COLUMNS = [
  { key: 'user', label: 'User' },
  {
    key: 'action',
    label: 'Action',
    render: (r) => (
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {r.action}
      </span>
    ),
  },
  { key: 'detail', label: 'Document' },
  { key: 'time', label: 'Time', render: (r) => formatDate(r.time, 'dd/MM/yyyy HH:mm') },
  { key: 'ip', label: 'IP' },
]

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-48" />
    </div>
  )
}

export default function AdminDashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminService.getDashboard,
  })

  const {
    data: logs,
    isLoading: logsLoading,
  } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: adminService.getActivityLogs,
  })

  if (statsLoading) return <DashboardSkeleton />

  if (statsError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-500">
        <p className="text-sm">Không thể tải dữ liệu dashboard.</p>
        <p className="text-xs text-slate-400">Kiểm tra kết nối backend hoặc quyền truy cập.</p>
      </div>
    )
  }

  const uploadChart = stats?.uploadLast7Days ?? []
  const majorChart = stats?.majorDistribution ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Tổng người dùng"
          value={stats?.totalUsers?.toLocaleString() ?? '—'}
          icon={Users}
          accent="indigo"
        />
        <StatsCard
          title="Tổng tài liệu"
          value={stats?.totalDocuments?.toLocaleString() ?? '—'}
          icon={FileText}
          accent="sky"
        />
        <StatsCard
          title="Tổng dung lượng"
          value={stats?.totalStorageDisplay ?? '—'}
          icon={Cloud}
          accent="emerald"
        />
        <StatsCard
          title="Tổng số upload"
          value={stats?.totalUploads ?? '—'}
          subtitle="files"
          icon={Upload}
          accent="amber"
        />
        <StatsCard
          title="Tổng lượt download"
          value={stats?.totalDownloads ?? '—'}
          subtitle="lượt"
          icon={Download}
          accent="indigo"
        />
        <StatsCard
          title="Tài liệu bị xóa"
          value={stats?.deletedDocuments ?? '—'}
          subtitle="files"
          icon={Trash2}
          accent="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Upload theo ngày (7 ngày gần nhất)</h2>
          {uploadChart.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={uploadChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Uploads" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Phân bổ theo chuyên ngành</h2>
          {majorChart.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={majorChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {majorChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} tài liệu`, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold">Hoạt động gần đây</h2>
        <DataTable
          columns={LOG_COLUMNS}
          data={Array.isArray(logs) ? logs.slice(0, 10) : []}
          isLoading={logsLoading}
        />
      </div>
    </div>
  )
}