import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { usePublicDocuments } from '@/hooks/useDocuments'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const chips = {
  major: ['Tất cả', 'CNTT', 'MMT', 'KHDL'],
  semester: ['HK1', 'HK2'],
  type: ['PDF', 'DOCX', 'PPTX'],
}

export default function PublicRepositoryPage() {
  const [search, setSearch] = useState('')
  const [major, setMajor] = useState('')
  const [type, setType] = useState('')
  const { data: docs, isLoading } = usePublicDocuments({
    search,
    major: major === 'Tất cả' ? '' : major,
    type,
  })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">🌐 Kho Tài Liệu Công Khai</h1>
        <p className="mt-2 text-slate-500">Tìm kiếm và tải tài liệu học tập từ cộng đồng sinh viên</p>
        <div className="relative mx-auto mt-6 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-12 pl-12"
            placeholder="Tìm tài liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {chips.major.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setMajor(c)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              (major || 'Tất cả') === c ? 'bg-primary text-white' : 'bg-white border border-slate-200'
            )}
          >
            {c}
          </button>
        ))}
        {chips.type.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setType(type === c ? '' : c)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium',
              type === c ? 'bg-primary text-white' : 'bg-white border border-slate-200'
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {(docs || []).map((doc) => {
            const { badge } = getFileTypeConfig(doc.type)
            return (
              <Card key={doc.id} className="hover:scale-[1.01] hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', badge)}>{doc.type}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-medium">{doc.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{doc.subject} · {doc.major}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{doc.uploader?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-600">{doc.uploader?.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(doc.createdAt)} · ⬇️ {doc.downloadCount} lượt
                  </p>
                  <Button className="mt-3 w-full gap-2" size="sm">
                    <Download className="h-4 w-4" /> Tải xuống
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled>
          Trước
        </Button>
        <Button variant="outline">
          Sau
        </Button>
      </div>
    </div>
  )
}
