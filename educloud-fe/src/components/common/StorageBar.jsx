import { Progress } from '@/components/ui/progress'
import { formatBytes } from '@/utils/formatBytes'
import { cn } from '@/lib/utils'

export default function StorageBar({ used, total, className }) {
  const pctRaw = total ? (used / total) * 100 : 0
  const percent = pctRaw < 1 && pctRaw > 0 ? parseFloat(pctRaw.toFixed(2)) : Math.round(pctRaw)
  const displayPercent = Math.max(pctRaw, pctRaw > 0 ? 0.5 : 0) // tối thiểu 0.5% để hiện màu
  const warning = percent > 80

  return (
    <div className={cn('space-y-3', className)}>
      <Progress
        value={displayPercent}
        className={cn('h-3', warning && '[&>div]:from-amber-500 [&>div]:to-red-500')}
      />
      <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600">
        <span>Đã dùng: {formatBytes(used)}</span>
        <span>Còn lại: {formatBytes(total - used)}</span>
        <span className="font-medium">Tổng: {formatBytes(total)}</span>
      </div>
      {warning && <p className="text-sm text-amber-600">⚠️ Dung lượng sắp đầy ({percent}%)</p>}
    </div>
  )
}