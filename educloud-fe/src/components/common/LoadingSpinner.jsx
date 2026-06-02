import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoadingSpinner({ className, size = 'default' }) {
  const sizes = { sm: 'h-4 w-4', default: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
    </div>
  )
}
