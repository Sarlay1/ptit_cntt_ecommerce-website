import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function Cart() {
  const { items, refreshCart, totalPrice } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [confirmItem, setConfirmItem] = useState(null)

  useEffect(() => {
    setLoading(true)
    refreshCart().finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    try {
      await cartApi.updateQuantity(itemId, quantity)
      await refreshCart()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleRemove = async () => {
    try {
      await cartApi.removeItem(confirmItem.id)
      await refreshCart()
      showToast('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setConfirmItem(null)
    }
  }

  if (loading) return <div className="container">Đang tải giỏ hàng...</div>

  return (
    <div className="container">
      <h1 style={styles.title}>Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="card" style={styles.empty}>
          <p>Giỏ hàng của bạn đang trống.</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      ) : (
        <div style={styles.layout}>
          <div className="card" style={{ flex: 2, padding: 20 }}>
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.productCell}>
                      <img src={item.imageUrl} alt={item.productName} style={styles.thumb} />
                      <span>{item.productName}</span>
                    </td>
                    <td>{formatVND(item.price)}</td>
                    <td>
                      <div style={styles.qtyControl}>
                        <button className="btn-secondary" style={styles.qtyBtn} onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button
                          className="btn-secondary"
                          style={styles.qtyBtn}
                          disabled={item.quantity >= item.availableStock}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#53614c' }}>{formatVND(item.subTotal)}</td>
                    <td>
                      <button className="btn-danger" onClick={() => setConfirmItem(item)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={styles.summary}>
            <h3 style={{ marginBottom: 16 }}>Tóm tắt đơn hàng</h3>
            <div style={styles.summaryRow}>
              <span>Tạm tính</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
            <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18, marginTop: 12 }}>
              <span>Tổng cộng</span>
              <span style={{ color: '#53614c' }}>{formatVND(totalPrice)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/checkout')}>
              Tiến hành đặt hàng
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmItem}
        title="XÁC NHẬN XÓA SẢN PHẨM"
        message={`Bạn có chắc chắn muốn xóa "${confirmItem?.productName}" khỏi giỏ hàng?`}
        onConfirm={handleRemove}
        onCancel={() => setConfirmItem(null)}
      />
    </div>
  )
}

const styles = {
  title: { fontSize: 24, fontWeight: 700, margin: '20px 0' },
  empty: { padding: 48, textAlign: 'center' },
  layout: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  productCell: { display: 'flex', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, objectFit: 'cover', borderRadius: 8 },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, padding: 0, lineHeight: '28px', textAlign: 'center' },
  summary: { flex: 1, minWidth: 280, padding: 24, height: 'fit-content' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151' }
}
