import { useEffect, useState } from 'react'
import { adminApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED']
const STATUS_LABEL = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Giao thành công',
  CANCELLED: 'Đã hủy'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const loadOrders = () => {
    setLoading(true)
    adminApi.getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === order.status) return
    try {
      await adminApi.updateOrderStatus(order.id, newStatus);
      // UC-04 Admin Update (mục 4.2.2.4 SRS)
      showToast(`Cập nhật trạng thái đơn hàng sang ${STATUS_LABEL[newStatus]} thành công.`)
      loadOrders()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) return <div className="container">Đang tải...</div>

  return (
    <div className="container">
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '20px 0' }}>Quản lý đơn hàng</h1>

      <div className="card" style={{ padding: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th><th>Người nhận</th><th>SĐT</th><th>Tổng tiền</th><th>Ngày tạo</th><th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.receiverName}</td>
                <td>{order.phoneNumber}</td>
                <td>{formatVND(order.totalPrice)}</td>
                <td>{new Date(order.createdDate).toLocaleString('vi-VN')}</td>
                <td>
                  <select
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ marginTop: 16, color: '#6b7280' }}>Chưa có đơn hàng nào.</p>}
      </div>
    </div>
  )
}
