import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, BookPlus } from 'lucide-react'
import { subjectService } from '@/services/admin/subjectService'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddSubjectDialog({ major }) {
    const [open, setOpen] = useState(false)
    const [subjectName, setSubjectName] = useState('')
    const [description, setDescription] = useState('')
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: () =>
            subjectService.addSubject(major.id, {
                majorCode: major.majorCode,
                subjectName,
                description,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects', major.id] })
            setSubjectName('')
            setDescription('')
            setOpen(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-dashed text-primary hover:bg-primary/5"
                >
                    <BookPlus className="h-4 w-4" />
                    Thêm môn học
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm môn học mới</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Chuyên ngành: <span className="font-medium">{major.majorName}</span> ({major.majorCode})
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="subjectName">Tên môn học</Label>
                        <Input
                            id="subjectName"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            placeholder="VD: Công nghệ phần mềm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Mô tả</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="VD: Môn học bổ trợ"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error.message}</p>}
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                        Huỷ
                    </Button>
                    <Button
                        type="button"
                        onClick={() => mutate()}
                        disabled={!subjectName.trim() || isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Thêm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}