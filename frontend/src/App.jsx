import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import OrderHistory from './pages/OrderHistory'
import ProductDetail from './pages/ProductDetail'
import ProductList from './pages/ProductList'
import Register from './pages/Register'

export default function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login adminOnly />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={<ProtectedRoute customerOnly><Cart /></ProtectedRoute>}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute customerOnly><Checkout /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute customerOnly><OrderHistory /></ProtectedRoute>}
          />
          <Route
            path="/admin/products"
            element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>}
          />
          <Route
            path="/admin/orders"
            element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
