import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'
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

export default function EditSubjectDialog({ subject, majorId }) {
    const [open, setOpen] = useState(false)
    const [subjectName, setSubjectName] = useState(subject.name ?? '')
    const [description, setDescription] = useState(subject.description ?? '')
    const queryClient = useQueryClient()

    // reset lại form mỗi khi mở dialog (tránh giữ state cũ từ lần sửa trước)
    useEffect(() => {
        if (open) {
            setSubjectName(subject.name ?? '')
            setDescription(subject.description ?? '')
        }
    }, [open, subject])

    const { mutate, isPending, error } = useMutation({
        mutationFn: () =>
            subjectService.updateSubject(subject.id, {
                subjectName,
                description,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects', majorId] })
            setOpen(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sửa môn học</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-subjectName">Tên môn học</Label>
                        <Input
                            id="edit-subjectName"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-description">Mô tả</Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}