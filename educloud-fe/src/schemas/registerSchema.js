import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Họ không được để trống'),
    lastName: z.string().min(1, 'Tên không được để trống'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Vui lòng chọn ngày sinh hợp lệ'),
    username: z.string().min(6, 'Tên đăng nhập tối thiểu 6 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    identityNumber: z
      .string()
      .min(12, 'Số định danh tối thiểu 12 ký tự')
      .regex(/^\d+$/, 'Chỉ nhập số'),
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
