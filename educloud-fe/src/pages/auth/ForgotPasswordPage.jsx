import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import AuthLayout from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = () => {
    toast.info('Tính năng đang được phát triển. Vui lòng liên hệ quản trị viên.')
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>
      <p className="mt-1 text-sm text-slate-500">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full">
          Gửi yêu cầu
        </Button>
        <Link to="/login" className="block text-center text-sm text-primary hover:underline">
          Quay lại đăng nhập
        </Link>
      </form>
    </AuthLayout>
  )
}
