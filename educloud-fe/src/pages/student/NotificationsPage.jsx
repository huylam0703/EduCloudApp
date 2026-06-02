import { useState } from 'react'
import { CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { mockNotifications } from '@/mocks/notifications'
import { formatTimeAgo } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const iconMap = {
  upload: { Icon: CheckCircle, className: 'text-emerald-500 bg-emerald-50' },
  admin: { Icon: AlertTriangle, className: 'text-amber-500 bg-amber-50' },
  system: { Icon: Info, className: 'text-blue-500 bg-blue-50' },
}

export default function NotificationsPage() {
  const [items, setItems] = useState(mockNotifications)

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Thông báo</h1>
        <Button variant="outline" onClick={markAllRead}>
          Đánh dấu tất cả đã đọc
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((n) => {
          const { Icon, className } = iconMap[n.type] || iconMap.system
          return (
            <div
              key={n.id}
              className={cn(
                'flex gap-4 rounded-xl border bg-white p-4 transition-colors',
                !n.read && 'border-l-4 border-l-blue-500 bg-blue-50/50'
              )}
            >
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', className)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('font-medium', !n.read && 'font-semibold')}>{n.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{n.message}</p>
                <p className="mt-2 text-xs text-slate-400">{formatTimeAgo(n.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
