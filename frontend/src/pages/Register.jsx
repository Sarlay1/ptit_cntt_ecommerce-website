import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Không thể tạo tài khoản')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">CỬA HÀNG TRỰC TUYẾN</p>
      <h1>Tạo tài khoản khách hàng</h1>
      <p className="muted">Tài khoản đăng ký mới có quyền mua sắm; tài khoản Admin được cấp riêng.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Tên đăng nhập
          <input
            autoComplete="username"
            minLength="4"
            maxLength="50"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            autoComplete="new-password"
            minLength="6"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <small>Tối thiểu 6 ký tự.</small>
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" disabled={loading}>
          {loading ? 'Đang tạo tài khoản…' : 'Đăng ký khách hàng'}
        </button>
      </form>
      <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập khách hàng</Link></p>
    </section>
  )
}
