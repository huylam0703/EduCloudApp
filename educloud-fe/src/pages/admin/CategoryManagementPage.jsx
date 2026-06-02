import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function CategoryTab({ title, data, isLoading, extraColumn }) {
  const [adding, setAdding] = useState(false)
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    ...(extraColumn ? [extraColumn] : []),
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus className="mr-1 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      {adding && (
        <div className="flex gap-2 rounded-lg border bg-slate-50 p-3">
          <Input placeholder="Tên" />
          <Input placeholder="Mã" />
          <Button>Lưu</Button>
        </div>
      )}
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  )
}

export default function CategoryManagementPage() {
  const { data: majors, isLoading: mLoading } = useQuery({ queryKey: ['majors'], queryFn: adminService.getMajors })
  const { data: semesters, isLoading: sLoading } = useQuery({ queryKey: ['semesters'], queryFn: adminService.getSemesters })
  const { data: subjects, isLoading: subLoading } = useQuery({ queryKey: ['subjects'], queryFn: adminService.getSubjects })

  const subjectExtra = {
    key: 'major',
    label: 'Thuộc chuyên ngành',
    render: (s) => s.majorName,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý danh mục</h1>
      <Tabs defaultValue="majors">
        <TabsList>
          <TabsTrigger value="majors">Chuyên ngành</TabsTrigger>
          <TabsTrigger value="semesters">Học kỳ</TabsTrigger>
          <TabsTrigger value="subjects">Môn học</TabsTrigger>
        </TabsList>
        <TabsContent value="majors">
          <CategoryTab title="Chuyên ngành" data={majors} isLoading={mLoading} />
        </TabsContent>
        <TabsContent value="semesters">
          <CategoryTab title="Học kỳ" data={semesters} isLoading={sLoading} />
        </TabsContent>
        <TabsContent value="subjects">
          <CategoryTab title="Môn học" data={subjects} isLoading={subLoading} extraColumn={subjectExtra} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
