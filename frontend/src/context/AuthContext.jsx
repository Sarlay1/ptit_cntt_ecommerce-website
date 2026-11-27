import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)
const TOKEN_KEY = 'webbanhang.token'
const USER_KEY = 'webbanhang.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const saveSession = (data) => {
    const account = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role
    }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(account))
    setUser(account)
    return account
  }

  const login = async (username, password, expectedRole) => {
    const { data } = await authApi.login({ username, password })
    if (data.role !== expectedRole) {
      throw new Error(expectedRole === 'ADMIN'
        ? 'Tài khoản này không có quyền quản trị. Hãy dùng đăng nhập khách hàng.'
        : 'Đây là tài khoản quản trị. Hãy dùng mục Đăng nhập Admin.')
    }
    return saveSession(data)
  }

  const register = async (username, email, password) => {
    const { data } = await authApi.register({ username, email, password })
    return saveSession(data)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = user?.role === 'ADMIN' || user?.role === 'CUSTOMER'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider')
  return ctx
}
