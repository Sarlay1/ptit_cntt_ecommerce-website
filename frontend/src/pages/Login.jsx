import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login({ adminOnly = false }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = adminOnly ? 'ADMIN' : 'CUSTOMER'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password, role)
      navigate(location.state?.from?.pathname || (adminOnly ? '/admin/products' : '/'), { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">CỬA HÀNG TRỰC TUYẾN</p>
      <h1>{adminOnly ? 'Đăng nhập quản trị' : 'Đăng nhập khách hàng'}</h1>
      <p className="muted">
        {adminOnly
          ? 'Dành riêng cho quản trị viên để quản lý sản phẩm và đơn hàng.'
          : 'Đăng nhập để mua sắm, theo dõi giỏ hàng và đơn hàng.'}
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập hoặc email
          <input
            autoComplete="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" disabled={loading}>
          {loading ? 'Đang đăng nhập…' : adminOnly ? 'Đăng nhập Admin' : 'Đăng nhập khách hàng'}
        </button>
      </form>
      {!adminOnly && (
        <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký khách hàng</Link></p>
      )}
      <p className="auth-switch">
        {adminOnly
          ? <Link to="/login">Chuyển sang đăng nhập khách hàng</Link>
          : <Link to="/admin/login">Bạn là quản trị viên?</Link>}
      </p>
    </section>
  )
}
