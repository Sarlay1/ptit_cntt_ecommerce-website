import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false, customerOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return null

  if (!isAuthenticated) return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  if (customerOnly && isAdmin) return <Navigate to="/admin/products" replace />

  return children
}
