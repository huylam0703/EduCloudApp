import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash2 } from 'lucide-react'
import { subjectService } from '@/services/admin/subjectService'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function DeleteSubjectDialog({ subject, majorId }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => subjectService.deleteSubject(subject.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects', majorId] })
            setOpen(false)
        },
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xoá môn học?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc muốn xoá môn học{' '}
                        <span className="font-medium text-foreground">"{subject.name}"</span>?
                        Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Huỷ</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            mutate()
                        }}
                        disabled={isPending}
                        className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xoá
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}