import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerSchema } from '@/schemas/registerSchema'
import { useRegister } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = ({ confirmPassword, ...data }) => {
    registerMutation.mutate(data)
  }

  const field = (name, label, type = 'text', extra = {}) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} className="mt-1.5" {...register(name)} {...extra} />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
    </div>
  )

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-slate-900">Tạo tài khoản mới</h1>
      <p className="mt-1 text-sm text-slate-500">Điền đầy đủ thông tin để đăng ký EduCloud</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {field('firstName', 'Họ')}
        {field('lastName', 'Tên')}
        {field('dob', 'Ngày sinh', 'date')}
        {field('username', 'Tên đăng nhập')}
        {field('email', 'Email', 'email')}
        <div>
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            inputMode="numeric"
            className="mt-1.5"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <div className="relative mt-1.5">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </div>
        <p className="text-center text-sm text-slate-500 md:col-span-2">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
