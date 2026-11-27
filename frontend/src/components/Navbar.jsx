import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    const loginPath = isAdmin ? '/admin/login' : '/login'
    logout()
    navigate(loginPath)
  }

  // Hàm sinh className cho NavLink: hover đổi nền, đang ở trang đó (active) thì giữ nguyên nền đó
  const navClass = ({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')

  return (
    <>
      <div className="store-announcement">MỸ PHẨM ĐƯỢC CHỌN LỌC CHO CHU TRÌNH HẰNG NGÀY <span>·</span> LUMI BEAUTY</div>
      <nav style={styles.nav}>
        <div className="site-nav-inner">
          <NavLink to="/" end className="site-logo">LUMI <span className="brand-accent">BEAUTY</span></NavLink>

          <div className="site-nav-links">
            <NavLink to="/" end className={navClass}>Trang chủ</NavLink>
            <a className="nav-link" href="/#catalog">Sản phẩm</a>
            <a className="nav-link" href="/#luxury">Bộ sưu tập cao cấp</a>

            {isAdmin ? (
                <>
                  <NavLink to="/admin/products" className={navClass}>Quản lý sản phẩm</NavLink>
                  <NavLink to="/admin/orders" className={navClass}>Quản lý đơn hàng</NavLink>
                </>
            ) : isAuthenticated ? (
                <>
                  <NavLink to="/cart" className={({ isActive }) => 'nav-link nav-link-cart' + (isActive ? ' nav-link-active' : '')}>
                    Giỏ hàng
                    {totalCount > 0 && <span style={styles.badge}>{totalCount}</span>}
                  </NavLink>
                  {isAuthenticated && <NavLink to="/orders" className={navClass}>Đơn hàng của tôi</NavLink>}
                </>
            ) : null}

            {isAuthenticated ? (
                <div style={styles.userBox}>
                  <span style={styles.userName}>
                    {isAdmin ? 'Quản trị viên' : 'Khách hàng'} · {user.username}
                  </span>
                  <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
                </div>
            ) : (
                <>
                  <NavLink to="/login" className={navClass}>Đăng nhập khách hàng</NavLink>
                  <NavLink to="/admin/login" className={navClass}>Đăng nhập Admin</NavLink>
                  <NavLink to="/register" style={styles.registerBtn}>Đăng ký</NavLink>
                </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

const styles = {
  nav: { backgroundColor: '#fbfaf7', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #e8e4da' },
  badge: { position: 'absolute', top: -6, right: -2, backgroundColor: '#566453', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '1px 6px' },
  userBox: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 },
  userName: { color: '#5e6256', fontSize: 13 },
  logoutBtn: { background: 'transparent', border: '1px solid #dcd8ce', color: '#4d5148', padding: '7px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 13 },
  registerBtn: { backgroundColor: '#566453', color: '#fff', padding: '9px 16px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontWeight: 600, marginLeft: 4 }
}