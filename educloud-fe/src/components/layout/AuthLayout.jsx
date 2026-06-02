import { motion } from 'framer-motion'
import { Upload, Search, Download, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon: Upload, text: 'Upload tài liệu nhanh chóng' },
  { icon: Search, text: 'Tìm kiếm thông minh' },
  { icon: Download, text: 'Tải xuống mọi lúc' },
]

export default function AuthLayout({ children, title }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[40%] overflow-hidden bg-gradient-to-br from-indigo-950 via-[#1E1B4B] to-indigo-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">EduCloud</span>
          </Link>
          <p className="mt-4 text-indigo-200">Lưu trữ tài liệu học tập trên Cloud</p>
        </div>
        <ul className="relative z-10 space-y-4">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-indigo-100">
              <div className="rounded-lg bg-white/10 p-2">
                <Icon className="h-5 w-5" />
              </div>
              {text}
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              style={{ width: 120, height: 80, left: `${10 + i * 25}%`, top: `${20 + i * 15}%` }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FileText className="h-8 w-8 text-white/40" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          {title && <h1 className="mb-6 text-2xl font-semibold text-slate-900 lg:hidden">{title}</h1>}
          {children}
        </motion.div>
      </div>
    </div>
  )
}
