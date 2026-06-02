import { FileText, FileSpreadsheet, Presentation, Archive, File } from 'lucide-react'

const FILE_TYPE_CONFIG = {
  PDF: { Icon: FileText, color: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  DOCX: { Icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  DOC: { Icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  PPTX: { Icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  PPT: { Icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  XLSX: { Icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  XLS: { Icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  ZIP: { Icon: Archive, color: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
}

export function getFileTypeConfig(type) {
  const key = (type || '').toUpperCase().replace('.', '')
  return FILE_TYPE_CONFIG[key] || { Icon: File, color: 'text-slate-500', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-700' }
}

export function getFileExtension(filename) {
  if (!filename) return ''
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toUpperCase() : ''
}
