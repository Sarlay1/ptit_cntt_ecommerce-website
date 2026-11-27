import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, cartApi } from '../api/endpoints'
import InteractiveImage from '../components/InteractiveImage'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const { isAuthenticated, isAdmin } = useAuth()
  const { refreshCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    productApi.getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => showToast('Không tìm thấy sản phẩm', 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await cartApi.addToCart(product.id, quantity)
      await refreshCart()
      showToast('🛒 Thêm vào giỏ hàng thành công!')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="container">Đang tải...</div>
  if (!product) return <div className="container">Không tìm thấy sản phẩm.</div>

  return (
    <div className="container">
      <div className="card" style={styles.wrapper}>
        <InteractiveImage
          className="product-detail-image"
          src={product.imageUrl || '/cosmetic-placeholder.svg'}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/cosmetic-placeholder.svg'
          }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={styles.name}>{product.name}</h1>
          {product.categoryName && <div style={styles.category}>Danh mục: {product.categoryName}</div>}
          <div style={styles.price}>{formatVND(product.price)}</div>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.stock}>
            Tồn kho: <strong>{product.quantity}</strong>
          </div>

          {!isAdmin && (
            <>
              <div style={styles.qtyRow}>
                <label className="form-label" style={{ marginBottom: 0 }}>Số lượng:</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: 90 }}
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
                />
              </div>

              <button
                className="btn-primary"
                style={{ marginTop: 16, width: 220 }}
                disabled={product.quantity === 0 || adding}
                onClick={handleAddToCart}
              >
                {product.quantity === 0 ? 'Hết hàng' : adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', gap: 32, padding: 32, flexWrap: 'wrap' },
  name: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  category: { color: '#6b7280', fontSize: 13, marginBottom: 12 },
  price: { fontSize: 26, color: '#53614c', fontWeight: 700, marginBottom: 16 },
  desc: { color: '#676a61', lineHeight: 1.8, marginBottom: 20 },
  stock: { fontSize: 14, marginBottom: 16 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 12 }
}
