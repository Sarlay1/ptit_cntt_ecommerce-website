import { useEffect, useState } from 'react'
import { orderApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const STATUS_LABEL = {
  PENDING: { text: 'Chờ xử lý', color: '#92400e', bg: '#fef3c7' },
  CONFIRMED: { text: 'Đã xác nhận', color: '#1e40af', bg: '#dbeafe' },
  SHIPPING: { text: 'Đang giao', color: '#5b21b6', bg: '#ede9fe' },
  DELIVERED: { text: 'Giao thành công', color: '#166534', bg: '#dcfce7' },
  CANCELLED: { text: 'Đã hủy', color: '#991b1b', bg: '#fee2e2' }
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmOrder, setConfirmOrder] = useState(null)
  const { showToast } = useToast()

  const loadOrders = () => {
    setLoading(true)
    orderApi.getMyOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = async () => {
    try {
      await orderApi.cancel(confirmOrder.id)
      showToast('🗑️ Hủy đơn hàng thành công. Số lượng sản phẩm đã được hoàn lại kho.')
      loadOrders()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setConfirmOrder(null)
    }
  }

  if (loading) return <div className="container">Đang tải đơn hàng...</div>

  return (
    <div className="container">
      <h1 style={styles.title}>Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => {
            const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED'
            const statusInfo = STATUS_LABEL[order.status] || {}
            return (
              <div key={order.id} className="card" style={{ padding: 20 }}>
                <div style={styles.header}>
                  <div>
                    <strong>Đơn hàng #{order.id}</strong>
                    <span style={styles.date}> · {new Date(order.createdDate).toLocaleString('vi-VN')}</span>
                  </div>
                  <span style={{ ...styles.badge, color: statusInfo.color, backgroundColor: statusInfo.bg }}>
                    {statusInfo.text}
                  </span>
                </div>

                <table style={{ marginTop: 12 }}>
                  <tbody>
                    {order.orderDetails.map((d, idx) => (
                      <tr key={idx}>
                        <td>{d.productName}</td>
                        <td>x{d.quantity}</td>
                        <td>{formatVND(d.subTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={styles.footer}>
                  <div style={styles.shipInfo}>
                    <div>Người nhận: {order.receiverName} - {order.phoneNumber}</div>
                    <div>Địa chỉ: {order.shippingAddress}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={styles.total}>Tổng: {formatVND(order.totalPrice)}</div>
                    {canCancel && (
                      <button className="btn-danger" style={{ marginTop: 8 }} onClick={() => setConfirmOrder(order)}>
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmOrder}
        title="XÁC NHẬN HỦY ĐƠN"
        message="Hành động này sẽ giải phóng sản phẩm quay lại kho hàng. Bạn có chắc chắn muốn hủy? Thao tác này không thể hoàn tác."
        confirmText="ĐỒNG Ý HỦY"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOrder(null)}
      />
    </div>
  )
}

const styles = {
  title: { fontSize: 24, fontWeight: 700, margin: '20px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: 'var(--color-muted)', fontSize: 13, fontWeight: 400 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--color-border)' },
  shipInfo: { fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 },
  total: { fontWeight: 700, fontSize: 16, color: 'var(--color-brown)' }
}
