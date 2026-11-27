import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Gắn JWT token vào mọi request (nếu đã đăng nhập)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('webbanhang.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token hết hạn / không hợp lệ -> đăng xuất
      localStorage.removeItem('webbanhang.token')
      localStorage.removeItem('webbanhang.user')
      if (!window.location.pathname.startsWith('/login')
        && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = window.location.pathname.startsWith('/admin')
          ? '/admin/login'
          : '/login'
      }
    }
    const apiError = error.response?.data
    const message = apiError?.message
      || (error.code === 'ECONNABORTED'
        ? 'Máy chủ phản hồi quá chậm. Vui lòng thử lại.'
        : !error.response
          ? 'Không thể kết nối máy chủ. Kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.'
          : error.message || 'Yêu cầu không thành công')
    return Promise.reject({
      status: error.response?.status,
      errorCode: apiError?.errorCode || 'REQUEST_FAILED',
      fieldErrors: apiError?.fieldErrors || [],
      message
    })
  }
)

export default apiClient
