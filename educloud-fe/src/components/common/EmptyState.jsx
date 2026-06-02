import { cn } from '@/lib/utils'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
      {Icon && <Icon className="mb-4 h-16 w-16 text-slate-300" />}
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className={cn('mt-2 max-w-sm text-sm text-slate-500')}>{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
