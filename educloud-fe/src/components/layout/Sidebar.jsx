import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Globe,
  FolderOpen,
  Bell,
  User,
  Zap,
  Users,
  Tags,
  ScrollText,
  Cloud,
  LogOut,
  FileStack,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, isAdmin, getDisplayName } from '@/store/authStore'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useState } from 'react'
import { useLogout } from '@/hooks/useAuth'

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/repository', icon: Globe, label: 'Kho tài liệu' },
  { to: '/folders', icon: FolderOpen, label: 'Tài lệu của tôi' },
  { to: '/notifications', icon: Bell, label: 'Thông báo', badge: true },
  { to: '/profile', icon: User, label: 'Hồ sơ' },
]

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Người dùng' },
  { to: '/admin/documents', icon: FileStack, label: 'Tài liệu' },
  { to: '/admin/categories', icon: Tags, label: 'Danh mục' },
  { to: '/admin/logs', icon: ScrollText, label: 'Activity Log' },
  { to: '/admin/storage', icon: Cloud, label: 'Cloud Storage' },
]

function NavItem({ to, icon: Icon, label, collapsed, badge }) {
  const unread = 0

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white',
          isActive && 'bg-white/10 text-white',
          collapsed && 'justify-center px-2'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-indigo-400" />
          )}

          <Icon className="h-5 w-5 shrink-0" />

          {!collapsed && (
            <>
              <span className="flex-1">{label}</span>

              {badge && unread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white animate-pulse">
                  {unread}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ collapsed = false, onNavigate }) {
  const user = useAuthStore((s) => s.user)
  const admin = isAdmin(user)
  const logout = useLogout()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const displayName = getDisplayName(user)
  const roleLabel = admin ? 'Admin' : 'Student'

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-[#1E1B4B] text-white transition-all duration-200',
        collapsed ? 'w-16' : 'w-[240px]'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/10 p-4',
          collapsed && 'justify-center'
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
          <FileText className="h-5 w-5" />
        </div>

        {!collapsed && <span className="text-lg font-bold">EduCloud</span>}
      </div>

      {!collapsed && (
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Avatar>
            <AvatarFallback className="bg-indigo-400 text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>

            <Badge
              variant="secondary"
              className="mt-1 bg-white/10 text-white hover:bg-white/10"
            >
              {roleLabel}
            </Badge>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {!admin && studentNav.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={onNavigate}
          >
            <NavItem {...item} collapsed={collapsed} />
          </motion.div>
        ))}

        {admin && (
          <>
            {/*{!collapsed && (*/}
            {/*  <div className="my-3 flex items-center gap-2 px-3 text-xs text-white/40">*/}
            {/*    <span className="flex-1 border-t border-white/10" />*/}
            {/*    <Zap className="h-3 w-3" />*/}
            {/*    Admin*/}
            {/*    <span className="flex-1 border-t border-white/10" />*/}
            {/*  </div>*/}
            {/*)}*/}

            {admin && adminNav.map((item) => (
              <div key={item.to} onClick={onNavigate}>
                <NavItem {...item} collapsed={collapsed} />
              </div>
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/10',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        onConfirm={logout}
        confirmLabel="Đăng xuất"
      />
    </aside>
  )
}