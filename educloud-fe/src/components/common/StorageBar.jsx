import { Progress } from '@/components/ui/progress'
import { formatBytes } from '@/utils/formatBytes'
import { cn } from '@/lib/utils'

export default function StorageBar({ used, total, className }) {
  const percent = total ? Math.min(100, Math.round((used / total) * 100)) : 0
  const warning = percent > 80

  return (
    <div className={cn('space-y-3', className)}>
      <Progress value={percent} className={cn('h-3', warning && '[&>div]:from-amber-500 [&>div]:to-red-500')} />
      <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600">
        <span>Đã dùng: {formatBytes(used)}</span>
        <span>Còn lại: {formatBytes(total - used)}</span>
        <span className="font-medium">Tổng: {formatBytes(total)}</span>
      </div>
      {warning && <p className="text-sm text-amber-600">⚠️ Dung lượng sắp đầy ({percent}%)</p>}
    </div>
  )
}
