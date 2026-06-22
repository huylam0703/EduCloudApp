import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { notificationService } from '@/services/notificationService'
import { userService } from '@/services/userService'
import { getDisplayName } from '@/store/authStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const VIOLATION_TEMPLATE_CODE = 'VIOLATION_WARNING'

const TYPE_BADGE = {
  INFO: { variant: 'secondary', className: '' },
  WARNING: { variant: 'warning', className: 'ring-2 ring-amber-300 font-bold' },
  SUCCESS: { variant: 'success', className: '' },
  ERROR: { variant: 'destructive', className: '' },
  DOWNLOAD: { variant: 'default', className: '' },
}

function getUserOptionLabel(user) {
  const name = getDisplayName(user)
  return user.email ? `${name} — ${user.email}` : name
}

export default function AdminNotificationPage() {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedTemplateCode, setSelectedTemplateCode] = useState('')

  const requiresUserSelection = selectedTemplateCode === VIOLATION_TEMPLATE_CODE

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminNotificationUsers'],
    queryFn: userService.getAllUsers,
    enabled: requiresUserSelection,
  })

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['notificationTemplates'],
    queryFn: notificationService.getTemplates,
  })

  const sendMutation = useMutation({
    mutationFn: async ({ requiresUser, userId, templateCode }) => {
      if (requiresUser) {
        return notificationService.sendTemplate({ userId, templateCode })
      }
      return notificationService.sendTemplateToAll({ templateCode })
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.requiresUser
          ? 'Gửi thông báo thành công'
          : 'Gửi thông báo thành công cho tất cả người dùng'
      )
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Gửi thông báo thất bại')
    },
  })

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId]
  )

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.code === selectedTemplateCode) ?? null,
    [templates, selectedTemplateCode]
  )

  const isFormLoading = templatesLoading || (requiresUserSelection && usersLoading)
  const canSend =
    Boolean(selectedTemplateCode) &&
    (!requiresUserSelection || selectedUserId) &&
    !sendMutation.isPending

  const handleTemplateChange = (templateCode) => {
    setSelectedTemplateCode(templateCode)
    if (templateCode !== VIOLATION_TEMPLATE_CODE) {
      setSelectedUserId('')
    }
  }

  const handleSend = () => {
    if (!selectedTemplateCode) return
    if (requiresUserSelection && !selectedUserId) return

    sendMutation.mutate({
      requiresUser: requiresUserSelection,
      userId: selectedUserId,
      templateCode: selectedTemplateCode,
    })
  }

  const typeBadge = selectedTemplate
    ? TYPE_BADGE[selectedTemplate.type] || TYPE_BADGE.INFO
    : null

  const recipientPreview = requiresUserSelection
    ? selectedUser
      ? getUserOptionLabel(selectedUser)
      : 'Chưa chọn người dùng'
    : 'Tất cả người dùng'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gửi thông báo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Chọn mẫu thông báo để gửi. Mẫu &quot;Cảnh báo vi phạm&quot; gửi cho một người dùng;
          các mẫu khác gửi cho toàn bộ người dùng.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tạo thông báo</CardTitle>
            <CardDescription>
              Chọn mẫu thông báo. Chỉ mẫu cảnh báo vi phạm mới cần chọn người nhận.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isFormLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {requiresUserSelection && <Skeleton className="h-10 w-full" />}
                <Skeleton className="h-10 w-32" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="template">Mẫu thông báo</Label>
                  <Select
                    value={selectedTemplateCode || undefined}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger id="template">
                      <SelectValue placeholder="-- Chọn template --" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.code} value={template.code}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {requiresUserSelection && (
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Người nhận</Label>
                    <Select
                      value={selectedUserId || undefined}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger id="recipient">
                        <SelectValue placeholder="-- Chọn người dùng --" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {getUserOptionLabel(user)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={!canSend}
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                  Gửi thông báo
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xem trước thông báo</CardTitle>
            <CardDescription>Nội dung sẽ được gửi tới người nhận.</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedTemplate ? (
              <p className="text-sm text-slate-500">
                Chọn một mẫu thông báo để xem trước nội dung.
              </p>
            ) : (
              <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <div>
                  <Badge
                    variant={typeBadge.variant}
                    className={cn(typeBadge.className)}
                  >
                    {selectedTemplate.type}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Tiêu đề
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedTemplate.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Nội dung
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {selectedTemplate.message}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <span className="font-medium text-slate-700">Người nhận:</span>
                    <span className="text-slate-600">{recipientPreview}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <span className="font-medium text-slate-700">Phạm vi gửi:</span>
                    <span className="text-slate-600">
                      {requiresUserSelection ? 'Một người dùng' : 'Tất cả người dùng'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                    <span className="font-medium text-slate-700">Template code:</span>
                    <span className="font-mono text-slate-600">{selectedTemplate.code}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
