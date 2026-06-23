import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import AppLayout from '@/components/layout/AppLayout'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import DashboardPage from '@/pages/student/DashboardPage'
import MyDocumentsPage from '@/pages/student/MyDocumentsPage'
import PublicRepositoryPage from '@/pages/student/PublicRepositoryPage'
import FolderViewPage from '@/pages/student/FolderViewPage'
import NotificationsPage from '@/pages/student/NotificationsPage'
import ProfilePage from '@/pages/student/ProfilePage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import UserManagementPage from '@/pages/admin/UserManagementPage'
import DocumentManagementPage from '@/pages/admin/DocumentManagementPage'
import CategoryManagementPage from '@/pages/admin/CategoryManagementPage'
import ActivityLogPage from '@/pages/admin/ActivityLogPage'
import CloudStoragePage from '@/pages/admin/CloudStoragePage'
import AdminNotificationPage from '@/pages/admin/AdminNotificationPage'
import { useAuthStore, isAdmin } from '@/store/authStore'

function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={isAdmin(user) ? '/admin' : '/dashboard'} replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <RootRedirect /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      {
        element: (
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        ),
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'my-documents', element: <MyDocumentsPage /> },
          { path: 'repository', element: <PublicRepositoryPage /> },
          { path: 'folders', element: <FolderViewPage /> },
          { path: 'folders/:folderId', element: <FolderViewPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
          {
            path: 'admin',
            element: (
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/users',
            element: (
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/documents',
            element: (
              <AdminRoute>
                <DocumentManagementPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/categories',
            element: (
              <AdminRoute>
                <CategoryManagementPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/logs',
            element: (
              <AdminRoute>
                <ActivityLogPage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/storage',
            element: (
              <AdminRoute>
                <CloudStoragePage />
              </AdminRoute>
            ),
          },
          {
            path: 'admin/notifications',
            element: (
              <AdminRoute>
                <AdminNotificationPage />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
])
