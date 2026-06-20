import { useState } from 'react'
import { Search, Download, X } from 'lucide-react'
import { usePublicDocuments } from '@/hooks/useDocuments'
import { getFileTypeConfig } from '@/utils/fileTypeIcon'
import { formatDate } from '@/utils/formatDate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMajors } from '@/hooks/useMajor'

const fileTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'RAR', 'ZIP']

export default function PublicRepositoryPage() {
    const [search, setSearch] = useState('')
    const [majorId, setMajorId] = useState('')
    const [majorKeyword, setMajorKeyword] = useState('')
    const [type, setType] = useState('')
    const [showMajorSuggest, setShowMajorSuggest] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const pageSize = 9

    const { majors: filteredMajors, isLoading: majorsLoading } = useMajors(majorKeyword)

    const { data, isLoading } = usePublicDocuments({
        majorId,
        type,
        pageNo,
        pageSize,
    })

    const allDocs = data?.content ?? []
    const totalPages = data?.totalPages ?? 0


    const docs = search
        ? allDocs.filter((d) => d.documentName.toLowerCase().includes(search.toLowerCase()))
        : allDocs

    const handleSelectMajor = (item) => {
        setMajorId(item.id) // ⚠️ dùng id thật để filter API, không dùng majorName
        setMajorKeyword(item.majorName)
        setShowMajorSuggest(false)
        setPageNo(0)
    }

    const clearMajor = () => {
        setMajorId('')
        setMajorKeyword('')
        setShowMajorSuggest(false)
        setPageNo(0)
    }

    const handleTypeFilter = (val) => {
        setType(val)
        setPageNo(0)
    }

    const handleDownload = (doc) => {
        window.open(doc.fileUrl, '_blank')
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-semibold">🌐 Kho Tài Liệu Công Khai</h1>

                <p className="mt-2 text-slate-500">
                    Tìm kiếm và tải tài liệu học tập từ cộng đồng sinh viên
                </p>

                <div className="relative mx-auto mt-6 max-w-lg">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                        className="h-12 pl-12"
                        placeholder="Tìm tài liệu..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPageNo(0)
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleTypeFilter('')}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                            !type ? 'bg-primary text-white' : 'border border-slate-200 bg-white'
                        )}
                    >
                        Tất cả
                    </button>

                    {fileTypes.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => handleTypeFilter(type === item ? '' : item)}
                            className={cn(
                                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                type === item
                                    ? 'bg-primary text-white'
                                    : 'border border-slate-200 bg-white'
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="relative w-[380px]">
                    <div className="flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm">
                        <Input
                            className="h-full border-0 px-0 shadow-none focus-visible:ring-0"
                            placeholder="Tìm kiếm bằng ngành hoặc mã ngành..."
                            value={majorKeyword}
                            onFocus={() => setShowMajorSuggest(true)}
                            onChange={(e) => {
                                setMajorKeyword(e.target.value)
                                setMajorId('')
                                setShowMajorSuggest(true)
                            }}
                        />

                        {majorKeyword && (
                            <button
                                type="button"
                                onClick={clearMajor}
                                className="border-r border-slate-200 pr-3 text-slate-500 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}

                        <Search className="ml-3 h-5 w-5 text-green-500" />
                    </div>

                    {showMajorSuggest && (
                        <div className="absolute right-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                            <div className="max-h-72 overflow-y-auto">
                                <button
                                    type="button"
                                    onClick={clearMajor}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                                >
                                    <Search className="h-4 w-4 text-slate-400" />
                                    <span>Tất cả ngành</span>
                                </button>

                                {majorsLoading ? (
                                    <p className="px-3 py-3 text-sm text-slate-400">Đang tìm kiếm...</p>
                                ) : filteredMajors.length > 0 ? (
                                    filteredMajors.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleSelectMajor(item)}
                                            className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Search className="h-4 w-4 text-slate-400" />
                                                <span>{item.majorName}</span>
                                            </div>

                                            {item.majorCode && (
                                                <span className="text-xs text-slate-500">
                          {item.majorCode}
                        </span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-3 py-3 text-sm text-slate-400">
                                        Không tìm thấy ngành phù hợp
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            ) : docs.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">Không tìm thấy tài liệu nào</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {docs.map((doc) => {
                        const { badge } = getFileTypeConfig(doc.fileType)

                        return (
                            <Card
                                key={doc.id}
                                className="transition-all hover:scale-[1.01] hover:shadow-md"
                            >
                                <CardContent className="p-4">
                  <span
                      className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          badge
                      )}
                  >
                    {doc.fileType}
                  </span>

                                    <h3 className="mt-3 line-clamp-2 font-medium" title={doc.documentName}>
                                        {doc.documentName}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {doc.subjectName} · {doc.majorName}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {doc.uploadedByName?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="text-xs text-slate-600">
                      {doc.uploadedByName || 'Unknown'}
                    </span>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        {formatDate(doc.createdAt)} · ⬇️ {doc.downloadCount} lượt
                                    </p>

                                    <Button className="mt-3 w-full gap-2" size="sm" onClick={() => handleDownload(doc)}>
                                        <Download className="h-4 w-4" />
                                        Tải xuống
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <div className="flex justify-center gap-2">
                <Button
                    variant="outline"
                    disabled={pageNo <= 1}
                    onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                >
                    Trước
                </Button>

                <Button
                    variant="outline"
                    disabled={pageNo >= totalPages}
                    onClick={() => setPageNo((p) => p + 1)}
                >
                    Sau
                </Button>
            </div>
        </div>
    )
}