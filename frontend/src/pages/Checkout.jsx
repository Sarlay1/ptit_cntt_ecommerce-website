import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function Checkout() {
  const { items, refreshCart, totalPrice } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [receiverName, setReceiverName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    refreshCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Giỏ hàng đang trống, vui lòng thêm sản phẩm trước khi đặt hàng')
      return
    }

    setSubmitting(true)
    try {
      await orderApi.checkout({ receiverName, phoneNumber, shippingAddress })
      await refreshCart()
      // UC-01 Checkout (mục 4.2.2.1 SRS) -> toast + điều hướng về Lịch sử đơn mua
      showToast('🌟 Chúc mừng! Đơn hàng của bạn đã được tiếp nhận.')
      navigate('/orders')
    } catch (err) {
      setError(err.message || 'Đặt hàng thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p>Giỏ hàng của bạn đang trống, không thể đặt hàng.</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 style={styles.title}>Thanh toán đơn hàng</h1>

      <form onSubmit={handleSubmit} style={styles.layout}>
        {/* Bên trái: Form nhập thông tin giao hàng */}
        <div className="card" style={{ flex: 1, minWidth: 320, padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Thông tin giao hàng</h3>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Họ và tên người nhận</label>
            <input className="form-input" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Số điện thoại</label>
            <input className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required pattern="[0-9]{9,15}" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Địa chỉ giao hàng</label>
            <textarea className="form-input" rows={4} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
          </div>

          {error && <div className="error-text">{error}</div>}
        </div>

        {/* Bên phải: Bảng sản phẩm mua + nút xác nhận */}
        <div className="card" style={{ flex: 1, minWidth: 320, padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Sản phẩm đặt mua</h3>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>SL</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatVND(item.subTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.totalRow}>
            <span>Tổng cộng</span>
            <span style={{ color: '#53614c', fontWeight: 700, fontSize: 20 }}>{formatVND(totalPrice)}</span>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  title: { fontSize: 24, fontWeight: 700, margin: '20px 0' },
  layout: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }
}
