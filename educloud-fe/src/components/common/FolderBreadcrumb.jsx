import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { cn } from '@/lib/utils'

const BREADCRUMB_NAV_CLASS =
  'flex flex-wrap items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm shadow-sm'

function CrumbSeparator() {
  return <ChevronRight className="h-3.5 w-3.5 shrink-0 text-indigo-200" aria-hidden />
}

function CrumbLink({ to, children, isLast = false }) {
  if (isLast) {
    return (
      <span className="max-w-[220px] truncate font-medium text-white" title={children}>
        {children}
      </span>
    )
  }

  return (
    <Link
      to={to}
      className="max-w-[220px] truncate text-indigo-100 transition-colors hover:text-white"
      title={children}
    >
      {children}
    </Link>
  )
}

export default function FolderBreadcrumb({ folderId, className }) {
  const { data: chain = [], isLoading } = useBreadcrumb(folderId)

  return (
    <nav className={cn(BREADCRUMB_NAV_CLASS, className)} aria-label="Breadcrumb">
      <CrumbLink to="/dashboard">Home</CrumbLink>
      <CrumbSeparator />
      {folderId ? (
        <>
          <CrumbLink to="/folders">Thư mục</CrumbLink>
          {chain.map((item, index) => {
            const isLast = index === chain.length - 1
            return (
              <span key={item.id} className="flex items-center gap-1">
                <CrumbSeparator />
                <CrumbLink to={`/folders/${item.id}`} isLast={isLast}>
                  {item.name}
                </CrumbLink>
              </span>
            )
          })}
          {isLoading && chain.length === 0 && (
            <>
              <CrumbSeparator />
              <span className="text-indigo-200">...</span>
            </>
          )}
        </>
      ) : (
        <CrumbLink to="/folders" isLast>
          Thư mục
        </CrumbLink>
      )}
    </nav>
  )
}

export function AppBreadcrumb({ segments, routeLabels, folderId }) {
  if (segments[0] === 'folders') {
    return <FolderBreadcrumb folderId={folderId} />
  }

  const crumbs = segments.map((s, i) => ({
    label: routeLabels[s] || s,
    path: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <nav className={BREADCRUMB_NAV_CLASS} aria-label="Breadcrumb">
      <CrumbLink to="/dashboard">Home</CrumbLink>
      {crumbs.map((c, i) => (
        <span key={c.path} className="flex items-center gap-1">
          <CrumbSeparator />
          <CrumbLink to={c.path} isLast={i === crumbs.length - 1}>
            {c.label}
          </CrumbLink>
        </span>
      ))}
    </nav>
  )
}
