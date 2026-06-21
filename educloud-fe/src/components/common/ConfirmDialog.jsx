import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ConfirmDialog({
                                        open, onOpenChange, title, description, confirmText = 'Xác nhận',
                                        cancelText = 'Hủy', onConfirm, variant = 'default', loading = false,
                                      }) {
  return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault()
                  onConfirm()
                }}
                className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {loading ? 'Đang xử lý...' : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}