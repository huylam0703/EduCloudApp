import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  CheckCheck,
  Bell,
} from 'lucide-react'

import { formatTimeAgo } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const iconMap = {
  upload: {
    Icon: CheckCircle,
    className: 'text-emerald-500 bg-emerald-50',
  },
  download: {
    Icon: CheckCircle,
    className: 'text-indigo-500 bg-indigo-50',
  },
  admin: {
    Icon: AlertTriangle,
    className: 'text-amber-500 bg-amber-50',
  },
  system: {
    Icon: Info,
    className: 'text-blue-500 bg-blue-50',
  },
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all')

  const { data: notificationData } = useQuery({
  queryKey: ['notifications'],
  queryFn: notificationService.getMyNotifications,
})

const items = Array.isArray(notificationData)
  ? notificationData
  : notificationData?.content || notificationData?.result || []

  const { data: unreadData } = useQuery({
  queryKey: ['notificationUnreadCount'],
  queryFn: notificationService.getUnreadCount,
})

const unreadCount =
  typeof unreadData === 'number'
    ? unreadData
    : unreadData?.count || unreadData?.result || 0
  console.log('notificationData:', notificationData)
console.log('items:', items)
console.log('isArray:', Array.isArray(items))

  const filteredItems = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.read)
    if (filter === 'read') return items.filter((n) => n.read)
    return items
  }, [items, filter])

  const refreshNotifications = () => {
    queryClient.invalidateQueries({
      queryKey: ['notifications'],
    })

    queryClient.invalidateQueries({
      queryKey: ['notificationUnreadCount'],
    })
  }

  const markOneRead = async (id) => {
    try {
      await notificationService.readNotification(id)
      refreshNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationService.readAllNotifications()
      refreshNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteOne = async (id) => {
    try {
      await notificationService.deleteNotification(id)
      refreshNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAll = async () => {
    const ok = window.confirm(
      'Bạn có chắc muốn xoá tất cả thông báo không?'
    )

    if (!ok) return

    try {
      await notificationService.deleteAllNotifications()
      refreshNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Thông báo</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bạn có {unreadCount} thông báo chưa đọc
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>

          <Button
            variant="destructive"
            onClick={deleteAll}
            disabled={items.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xoá tất cả
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tất cả
          <Badge variant="secondary" className="ml-2">
            {items.length}
          </Badge>
        </Button>

        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc
          <Badge variant="secondary" className="ml-2">
            {unreadCount}
          </Badge>
        </Button>

        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
        >
          Đã đọc
          <Badge variant="secondary" className="ml-2">
            {items.length - unreadCount}
          </Badge>
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border bg-white p-8 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <Bell className="h-10 w-10 text-slate-400" />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            Không có thông báo
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Hiện tại chưa có thông báo nào phù hợp.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((n) => {
            const { Icon, className } =
              iconMap[n.type?.toLowerCase()] || iconMap.system

            return (
              <div
                key={n.id}
                onClick={() => markOneRead(n.id)}
                className={cn(
                  'group flex cursor-pointer gap-4 rounded-xl border bg-white p-4 transition-colors hover:bg-slate-50',
                  !n.read &&
                    'border-l-4 border-l-blue-500 bg-blue-50/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    className
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'font-medium',
                            !n.read && 'font-semibold'
                          )}
                        >
                          {n.title}
                        </p>

                        {!n.read && (
                          <Badge className="bg-blue-600 text-white">
                            Mới
                          </Badge>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {n.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatTimeAgo(n.createdAt)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteOne(n.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}