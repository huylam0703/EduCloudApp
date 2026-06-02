import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
