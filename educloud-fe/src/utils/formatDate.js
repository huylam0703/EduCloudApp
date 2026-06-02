import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date, pattern = 'dd/MM/yyyy') {
  if (!date) return ''
  return format(new Date(date), pattern, { locale: vi })
}

export function formatTimeAgo(date) {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
}

export function formatGreetingDate() {
  return format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })
}
