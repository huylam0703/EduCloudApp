import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { majorService } from '@/services/majorService'
import { subjectService } from '@/services/admin/subjectService.js'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataTable from '@/components/admin/DataTable'
import AddSubjectDialog from '@/components/admin/AddSubjectDialog'
import EditSubjectDialog from '@/components/admin/EditSubjectDialog'
import DeleteSubjectDialog from '@/components/admin/DeleteSubjectDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ScrollPaginatedTable({ columns, data, isLoading, pageSize = 20 }) {
    const { visibleData, sentinelRef, containerRef, hasMore } = useInfiniteScroll(data, pageSize)

    return (
        <div ref={containerRef} className="max-h-[600px] overflow-y-auto rounded-md border">
            <DataTable columns={columns} data={visibleData} isLoading={isLoading} />
            {hasMore && (
                <div ref={sentinelRef} className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải thêm...
                </div>
            )}
            {!isLoading && data.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có dữ liệu</p>
            )}
        </div>
    )
}

function MajorsTab() {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebouncedValue(search)

    const { data: majors = [], isLoading } = useQuery({
        queryKey: ['majors', debouncedSearch],
        queryFn: () => majorService.getMajors(debouncedSearch),
    })

    const columns = [
        { key: 'majorName', label: 'Name' },
        { key: 'majorCode', label: 'Code' },
        { key: 'description', label: 'Description'},
        {
            key: 'addSubject',
            label: 'actions',
            render: (major) => <AddSubjectDialog major={major} />,
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Chuyên ngành</h2>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm chuyên ngành..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <ScrollPaginatedTable columns={columns} data={majors} isLoading={isLoading} />
        </div>
    )
}

function MajorSelector({ majors, selectedMajor, onSelect }) {
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)

    const filtered = majors.filter(
        (m) =>
            m.majorName?.toLowerCase().includes(search.toLowerCase()) ||
            m.majorCode?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="relative w-80">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Chọn chuyên ngành để xem môn học..."
                    className="pl-8"
                    value={selectedMajor ? `${selectedMajor.majorName} (${selectedMajor.majorCode})` : search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        onSelect(null)
                        setOpen(true)
                    }}
                    onFocus={() => setOpen(true)}
                />
            </div>

            {open && (
                <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-white shadow-md">
                    {filtered.length === 0 && (
                        <p className="px-3 py-2 text-sm text-muted-foreground">Không tìm thấy</p>
                    )}
                    {filtered.map((m) => (
                        <button
                            key={m.id}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                            onClick={() => {
                                onSelect(m)
                                setSearch('')
                                setOpen(false)
                            }}
                        >
                            {m.majorName} <span className="text-muted-foreground">({m.majorCode})</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function SubjectsTab() {
    const [selectedMajor, setSelectedMajor] = useState(null)

    const { data: majors = [] } = useQuery({
        queryKey: ['majors', ''],
        queryFn: () => majorService.getMajors(''),
    })

    const { data: rawSubjects = [], isLoading } = useQuery({
        queryKey: ['subjects', selectedMajor?.id],
        queryFn: () => subjectService.getSubjectsByMajor(selectedMajor.id),
        enabled: !!selectedMajor,
    })

    // ⚠️ dùng subjectId thật để gọi update/delete, subjectCode chỉ để hiển thị
    // Nếu API trả về field tên khác (vd: "id"), đổi s.subjectId -> s.id cho khớp
    const subjects = rawSubjects.map((s) => ({
        id: s.id,
        code: s.subjectCode,
        name: s.subjectName,
        description: s.description,
        majorName: selectedMajor?.majorName,
    }))

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'major', label: 'Thuộc chuyên ngành', render: (s) => s.majorName },
        {
            key: 'actions',
            label: 'Actions',
            render: (subject) => (
                <div className="flex gap-1">
                    <EditSubjectDialog subject={subject} majorId={selectedMajor?.id} />
                    <DeleteSubjectDialog subject={subject} majorId={selectedMajor?.id} />
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Môn học</h2>
                <MajorSelector majors={majors} selectedMajor={selectedMajor} onSelect={setSelectedMajor} />
            </div>

            {!selectedMajor ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                    Vui lòng chọn một chuyên ngành để xem danh sách môn học
                </p>
            ) : (
                <ScrollPaginatedTable columns={columns} data={subjects} isLoading={isLoading} />
            )}
        </div>
    )
}

export default function CategoryManagementPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Quản lý danh mục</h1>
            <Tabs defaultValue="majors">
                <TabsList>
                    <TabsTrigger value="majors">Chuyên ngành</TabsTrigger>
                    <TabsTrigger value="subjects">Môn học</TabsTrigger>
                </TabsList>
                <TabsContent value="majors">
                    <MajorsTab />
                </TabsContent>
                <TabsContent value="subjects">
                    <SubjectsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}