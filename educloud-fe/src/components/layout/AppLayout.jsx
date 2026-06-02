import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import { useUiStore } from '@/store/uiStore'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed } = useUiStore()

  return (
    <div className="flex min-h-screen">
      <div className={cn('hidden lg:block', sidebarCollapsed && 'lg:w-16')}>
        <div className="fixed left-0 top-0 z-30 h-screen">
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
      </div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="border-0 p-0 lg:hidden">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-200',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[240px]'
        )}
      >
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
