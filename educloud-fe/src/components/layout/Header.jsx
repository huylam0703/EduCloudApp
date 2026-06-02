import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, ChevronRight } from 'lucide-react'
import { useAuthStore, getDisplayName } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockNotifications } from '@/mocks/notifications'
import { useLogout } from '@/hooks/useAuth'

const routeLabels = {
  dashboard: 'Dashboard',
  'my-documents': 'Tài liệu của tôi',
  repository: 'Kho tài liệu',
  folders: 'Thư mục',
  notifications: 'Thông báo',
  profile: 'Hồ sơ',
  admin: 'Admin',
  users: 'Người dùng',
  documents: 'Tài liệu',
  categories: 'Danh mục',
  logs: 'Activity Log',
  storage: 'Cloud Storage',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUiStore()
  const logout = useLogout()
  const unread = mockNotifications.filter((n) => !n.read).length

  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = segments.map((s, i) => ({
    label: routeLabels[s] || s,
    path: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-100 bg-white px-4 lg:px-6">
      <button
        type="button"
        className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="hidden rounded-lg p-2 hover:bg-slate-100 md:block lg:hidden"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>
      <nav className="hidden items-center gap-1 text-sm text-slate-500 md:flex">
        <Link to="/dashboard" className="hover:text-slate-900">
          Home
        </Link>
        {crumbs.map((c) => (
          <span key={c.path} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            <Link to={c.path} className="hover:text-slate-900">
              {c.label}
            </Link>
          </span>
        ))}
      </nav>
      <div className="mx-auto hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Tìm kiếm... (Ctrl+K)" className="w-full max-w-[400px] pl-9" />
        </div>
      </div>
      <button
        type="button"
        className="relative rounded-lg p-2 hover:bg-slate-100"
        onClick={() => navigate('/notifications')}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
            {unread}
          </span>
        )}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="rounded-full outline-none ring-2 ring-transparent focus:ring-primary/30">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                {getDisplayName(user).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/profile')}>Hồ sơ</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
