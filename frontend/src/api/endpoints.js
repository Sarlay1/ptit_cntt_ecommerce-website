import apiClient from './axiosClient'

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data)
}

export const productApi = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`)
}

export const categoryApi = {
  getAll: () => apiClient.get('/categories')
}

export const heroBannerApi = {
  getActiveSlides: () => apiClient.get('/banners')
}

export const cartApi = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity) => apiClient.post('/cart', { productId, quantity }),
  updateQuantity: (itemId, quantity) => apiClient.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => apiClient.delete(`/cart/${itemId}`)
}

export const orderApi = {
  checkout: (data) => apiClient.post('/orders', data),
  getMyOrders: () => apiClient.get('/orders'),
  cancel: (id) => apiClient.put(`/orders/${id}/cancel`)
}

export const adminApi = {
  getAllOrders: () => apiClient.get('/admin/orders'),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
  createProduct: (data) => apiClient.post('/admin/products', data),
  updateProduct: (id, data) => apiClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
  createCategory: (data) => apiClient.post('/admin/categories', data),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),
  getBannerSlides: () => apiClient.get('/admin/banners'),
  createBannerSlide: (data) => apiClient.post('/admin/banners', data),
  updateBannerSlide: (id, data) => apiClient.put(`/admin/banners/${id}`, data),
  deleteBannerSlide: (id) => apiClient.delete(`/admin/banners/${id}`),
  uploadImage: (formData) => apiClient.post('/admin/upload', formData)
}
