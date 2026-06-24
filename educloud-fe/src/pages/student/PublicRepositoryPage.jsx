import { useEffect, useRef, useState } from 'react'
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
import { useSubjects } from '@/hooks/useSubject'
import PreviewModal from '@/components/modals/PreviewModal.jsx'
import { documentApi } from '@/api/documentApi.js'

const fileTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'RAR', 'ZIP']

function normalizeVi(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function findMajorByKeyword(keyword, majors) {
  if (!keyword?.trim() || !majors?.length) return null
  const norm = normalizeVi(keyword)
  return majors.find((m) => normalizeVi(m.majorName) === norm) ?? null
}

function findSubjectByKeyword(keyword, subjects) {
  if (!keyword?.trim() || !subjects?.length) return null
  const norm = normalizeVi(keyword)
  return subjects.find((s) => normalizeVi(s.subjectName) === norm) ?? null
}

function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [ref, handler, enabled])
}

function SuggestItem({ onSelect, children, selected = false }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onSelect()
      }}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100',
        selected && 'bg-indigo-50 font-medium text-indigo-700'
      )}
    >
      {children}
    </button>
  )
}

export default function PublicRepositoryPage() {
  const [search, setSearch] = useState('')
  const [majorId, setMajorId] = useState('')
  const [majorKeyword, setMajorKeyword] = useState('')
  const [selectedMajorName, setSelectedMajorName] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [subjectKeyword, setSubjectKeyword] = useState('')
  const [selectedSubjectName, setSelectedSubjectName] = useState('')
  const [type, setType] = useState('')
  const [searchType, setSearchType] = useState('')
  const [searchMajorId, setSearchMajorId] = useState('')
  const [searchSubjectId, setSearchSubjectId] = useState('')
  const [searchCounter, setSearchCounter] = useState(0)
  const [showMajorSuggest, setShowMajorSuggest] = useState(false)
  const [showSubjectSuggest, setShowSubjectSuggest] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const pageSize = 9
  const [previewDoc, setPreviewDoc] = useState(null)

  const majorRef = useRef(null)
  const subjectRef = useRef(null)

  const { majors: filteredMajors, isLoading: majorsLoading } = useMajors(majorKeyword)
  const { subjects, isLoading: subjectsLoading } = useSubjects(majorId)

  const filteredSubjects = subjectKeyword.trim()
    ? subjects.filter((item) =>
        item.subjectName?.toLowerCase().includes(subjectKeyword.trim().toLowerCase())
      )
    : subjects

  const hasNoSubjects = Boolean(majorId) && !subjectsLoading && subjects.length === 0
  const hasSubjectSearchMiss =
    Boolean(majorId) &&
    !subjectsLoading &&
    subjects.length > 0 &&
    filteredSubjects.length === 0

  const resetPage = () => setPageNo(1)

  const handleSelectMajor = (item) => {
    if (!item) {
      clearMajor()
      return
    }

    setMajorId(item.id)
    setMajorKeyword(item.majorName)
    setSelectedMajorName(item.majorName)
    setSubjectId('')
    setSubjectKeyword('')
    setSelectedSubjectName('')
    setShowMajorSuggest(false)
    setShowSubjectSuggest(true)
    resetPage()
  }

  const clearMajor = () => {
    setMajorId('')
    setMajorKeyword('')
    setSelectedMajorName('')
    setSubjectId('')
    setSubjectKeyword('')
    setSelectedSubjectName('')
    setSearchMajorId('')
    setSearchSubjectId('')
    setShowMajorSuggest(false)
    setShowSubjectSuggest(false)
    setPageNo(1)
    setSearchCounter((prev) => prev + 1)
  }

  const clearSubject = () => {
    setSubjectId('')
    setSubjectKeyword('')
    setSelectedSubjectName('')
    setSearchSubjectId('')
    setShowSubjectSuggest(false)
    setPageNo(1)
    setSearchCounter((prev) => prev + 1)
  }

  const handleSelectSubject = (item) => {
    if (!item) {
      clearSubject()
      return
    }

    setSubjectId(item.id)
    setSubjectKeyword(item.subjectName)
    setSelectedSubjectName(item.subjectName)
    setShowSubjectSuggest(false)
    resetPage()
  }

  const openSubjectPicker = () => {
    if (!majorId) return
    setShowSubjectSuggest(true)
    setShowMajorSuggest(false)
  }

  const closeMajorSuggest = () => {
    if (!majorId && majorKeyword.trim()) {
      const match = findMajorByKeyword(majorKeyword, filteredMajors)
      if (match) {
        handleSelectMajor(match)
        return
      }
    }
    setShowMajorSuggest(false)
  }

  const closeSubjectSuggest = () => {
    if (majorId && !subjectId && subjectKeyword.trim() && !hasNoSubjects) {
      const match = findSubjectByKeyword(subjectKeyword, subjects)
      if (match) {
        handleSelectSubject(match)
        return
      }
    }
    setShowSubjectSuggest(false)
  }

  useEffect(() => {
    if (!majorId || subjectsLoading) return
    setShowSubjectSuggest(true)
    setShowMajorSuggest(false)
  }, [majorId, subjectsLoading, subjects.length])

  // Tự gán majorId khi keyword khớp chính xác (gõ tay hoặc chọn từ list)
  useEffect(() => {
    if (majorId || majorsLoading || !majorKeyword.trim()) return
    const match = findMajorByKeyword(majorKeyword, filteredMajors)
    if (match) {
      setMajorId(match.id)
      setSelectedMajorName(match.majorName)
      setMajorKeyword(match.majorName)
      setPageNo(1)
    }
  }, [filteredMajors, majorsLoading, majorKeyword, majorId])

  useClickOutside(majorRef, closeMajorSuggest, showMajorSuggest)
  useClickOutside(subjectRef, closeSubjectSuggest, showSubjectSuggest)

  const { data, isLoading } = usePublicDocuments({
    majorId: searchMajorId,
    subjectId: searchSubjectId,
    type: searchType,
    pageNo: pageNo || 1,
    pageSize: pageSize || 9,
    searchCounter,
  })

  const allDocs = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  const docs = allDocs.filter((d) =>
    !search.trim() ||
    d.documentName?.toLowerCase().includes(search.trim().toLowerCase())
  )

  const matchedMajor = majorId ? null : findMajorByKeyword(majorKeyword, filteredMajors)
  const matchedSubject = subjectId ? null : findSubjectByKeyword(subjectKeyword, subjects)
  const effectiveMajorId = majorId || matchedMajor?.id
  const effectiveSubjectId = subjectId || matchedSubject?.id
  const canSearch = Boolean(effectiveMajorId)

  const getSubjectPlaceholder = () => {
    if (!majorId) return 'Chọn ngành trước'
    if (subjectsLoading) return 'Đang tải môn học...'
    if (hasNoSubjects) return 'Không có môn học'
    return 'Chọn môn học theo ngành...'
  }

  const handleSearch = () => {
    const targetMajorId = effectiveMajorId
    const targetSubjectId = effectiveSubjectId

    if (!targetMajorId) {
      return
    }

    if (!majorId && matchedMajor) {
      setMajorId(targetMajorId)
      setSelectedMajorName(matchedMajor.majorName)
      setMajorKeyword(matchedMajor.majorName)
    }

    if (!subjectId && matchedSubject) {
      setSubjectId(targetSubjectId)
      setSelectedSubjectName(matchedSubject.subjectName)
      setSubjectKeyword(matchedSubject.subjectName)
    }

    setSearchMajorId(targetMajorId)
    setSearchSubjectId(targetSubjectId)
    setSearchType(type)
    setSearchCounter((prev) => prev + 1)
    resetPage()
  }

  const handleTypeFilter = (val) => {
    setType(val)
    setSearchType(val)
    setPageNo(1)
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
              resetPage()
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
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

        <div className="flex flex-wrap items-center gap-3">
          <div ref={majorRef} className="relative w-[320px]">
            <div className="flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm">
              <Input
                className="h-full border-0 px-0 shadow-none focus-visible:ring-0"
                placeholder="Tìm kiếm theo ngành..."
                value={majorKeyword}
                onFocus={() => {
                  setShowMajorSuggest(true)
                  setShowSubjectSuggest(false)
                }}
                onBlur={() => {
                  window.setTimeout(closeMajorSuggest, 150)
                }}
                onChange={(e) => {
                  const value = e.target.value
                  setMajorKeyword(value)
                  setShowMajorSuggest(true)
                  setShowSubjectSuggest(false)

                  if (selectedMajorName && value === selectedMajorName) {
                    return
                  }

                  setMajorId('')
                  setSelectedMajorName('')
                  setSubjectId('')
                  setSubjectKeyword('')
                  setSelectedSubjectName('')
                }}
              />

              {majorKeyword && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clearMajor()
                  }}
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
                  <SuggestItem onSelect={() => handleSelectMajor(null)}>
                    <Search className="h-4 w-4 text-slate-400" />
                    <span>Tất cả ngành</span>
                  </SuggestItem>

                  {majorsLoading ? (
                    <p className="px-3 py-3 text-sm text-slate-400">Đang tìm kiếm...</p>
                  ) : filteredMajors.length > 0 ? (
                    filteredMajors.map((item) => (
                      <SuggestItem
                        key={item.id}
                        selected={item.id === majorId}
                        onSelect={() => handleSelectMajor(item)}
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span>{item.majorName}</span>
                      </SuggestItem>
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

          <div ref={subjectRef} className="relative w-[320px]">
            <div
              className={cn(
                'flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm',
                !majorId && 'pointer-events-none opacity-60',
                hasNoSubjects && 'opacity-80'
              )}
            >
              <Input
                className="h-full border-0 px-0 shadow-none focus-visible:ring-0"
                placeholder={getSubjectPlaceholder()}
                value={subjectKeyword}
                readOnly={hasNoSubjects}
                onFocus={() => openSubjectPicker()}
                onClick={() => openSubjectPicker()}
                onBlur={() => {
                  window.setTimeout(closeSubjectSuggest, 150)
                }}
                onChange={(e) => {
                  if (!majorId || hasNoSubjects) return
                  const value = e.target.value
                  setSubjectKeyword(value)
                  setShowSubjectSuggest(true)
                  setShowMajorSuggest(false)

                  if (selectedSubjectName && value === selectedSubjectName) {
                    return
                  }

                  setSubjectId('')
                  setSelectedSubjectName('')
                }}
              />

              {subjectKeyword && majorId && !hasNoSubjects && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clearSubject()
                  }}
                  className="border-r border-slate-200 pr-3 text-slate-500 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <Search className="ml-3 h-5 w-5 shrink-0 text-green-500" />
            </div>

            {showSubjectSuggest && majorId && (
              <div className="absolute right-0 z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="max-h-72 overflow-y-auto">
                  {!hasNoSubjects && (
                    <SuggestItem onSelect={() => handleSelectSubject(null)}>
                      <Search className="h-4 w-4 text-slate-400" />
                      <span>Tất cả môn học</span>
                    </SuggestItem>
                  )}

                  {subjectsLoading ? (
                    <p className="px-3 py-3 text-sm text-slate-400">Đang tải môn học...</p>
                  ) : hasNoSubjects ? (
                    <p className="px-3 py-3 text-sm text-slate-500">Không có môn học</p>
                  ) : hasSubjectSearchMiss ? (
                    <p className="px-3 py-3 text-sm text-slate-400">
                      Không tìm thấy môn học phù hợp
                    </p>
                  ) : (
                    filteredSubjects.map((item) => (
                      <SuggestItem
                        key={item.id}
                        selected={item.id === subjectId}
                        onSelect={() => handleSelectSubject(item)}
                      >
                        <Search className="h-4 w-4 text-slate-400" />
                        <span>{item.subjectName}</span>
                      </SuggestItem>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            className="h-11"
            disabled={!canSearch}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11"
            onClick={() => {
              setPageNo(1)
              setSearchCounter((prev) => prev + 1)
            }}
          >
            Reload
          </Button>
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

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      Xem trước
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => documentApi.handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                      Tải xuống
                    </Button>
                  </div>
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
      <PreviewModal open={!!previewDoc} onOpenChange={(v) => !v && setPreviewDoc(null)} doc={previewDoc} />
    </div>
  )
}
