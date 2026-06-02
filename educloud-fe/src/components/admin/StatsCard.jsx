import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const accents = {
  indigo: 'border-l-indigo-500',
  sky: 'border-l-sky-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
}

export default function StatsCard({ title, value, subtitle, icon: Icon, accent = 'indigo' }) {
  return (
    <Card className={cn('border-l-4', accents[accent])}>
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-slate-50 p-2">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
