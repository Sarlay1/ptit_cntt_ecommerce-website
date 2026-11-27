import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { cartApi } from '../api/endpoints'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const { isAuthenticated, isAdmin } = useAuth()
  const { showToast } = useToast()

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || isAdmin) {
      setItems([])
      return
    }
    try {
      const res = await cartApi.getCart()
      setItems(res.data)
    } catch (error) {
      showToast(error.message || 'Không thể tải giỏ hàng', 'error')
    }
  }, [isAuthenticated, isAdmin, showToast])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.subTotal, 0)

  return (
    <CartContext.Provider value={{ items, refreshCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải được dùng bên trong CartProvider')
  return ctx
}
