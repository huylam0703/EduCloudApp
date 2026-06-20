import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1/eduCloud',
})

// Tự động gắn token vào MỌI request, không cần làm thủ công nữa
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('educloud-token') // đổi key cho đúng nơi bạn lưu token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// (tuỳ chọn) xử lý khi token hết hạn -> tự logout hoặc refresh
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // ví dụ: clear token, redirect về trang login
            // localStorage.removeItem('accessToken')
            // window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default apiClient