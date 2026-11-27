import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BeautyHero from '../components/BeautyHero'
import InteractiveImage from '../components/InteractiveImage'
import { productApi, categoryApi, cartApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  const { isAuthenticated, isAdmin } = useAuth()
  const { refreshCart } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data))
      .catch((error) => showToast(error.message || 'Không thể tải danh mục', 'error'))
  }, [showToast])

  useEffect(() => {
    let active = true
    setLoading(true)
    productApi.getAll({ keyword: keyword || undefined, categoryId: categoryId || undefined, size: 24 })
      .then((res) => {
        if (active) setProducts(res.data.content)
      })
      .catch((error) => {
        if (active) showToast(error.message || 'Không thể tải danh sách sản phẩm', 'error')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryId])

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để mua hàng', 'error')
      return
    }
    try {
      await cartApi.addToCart(productId, 1)
      await refreshCart()
      showToast('🛒 Thêm vào giỏ hàng thành công!') // UC-05 - mục 4.2.2.3 SRS
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="container">
      <BeautyHero />

      <section id="luxury" className="luxury-feature">
        <InteractiveImage
          className="luxury-feature-image"
          src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1100&q=85"
          alt="Các sản phẩm chăm sóc da cao cấp được sắp đặt tinh tế"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/cosmetic-placeholder.svg'
          }}
        />
        <div className="luxury-feature-copy">
          <span className="eyebrow">LUMI EDIT · CHỌN LỌC ĐẶC BIỆT</span>
          <h2>Chăm sóc cao cấp, bắt đầu từ những điều tinh tế.</h2>
          <p>
            Serum dưỡng chuyên sâu, kem dưỡng cao cấp và những kết cấu mượt nhẹ
            dành cho lúc bạn muốn chăm sóc làn da kỹ hơn.
          </p>
          <div className="luxury-details">
            <span>Công thức được chọn lọc</span>
            <span>Kết cấu và trải nghiệm tinh tế</span>
          </div>
          <a className="luxury-link" href="#catalog">Khám phá bộ sưu tập <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section id="catalog" className="beauty-catalog">
        <div className="beauty-section-heading">
          <div>
            <span className="eyebrow">ĐƯỢC LỰA CHỌN NHIỀU</span>
            <h2>Sản phẩm nổi bật</h2>
            <p className="muted">Những món được yêu thích trong chu trình chăm sóc mỗi ngày.</p>
          </div>
          <input
            className="form-input beauty-search"
            aria-label="Tìm kiếm mỹ phẩm"
            placeholder="Tìm serum, kem dưỡng, son..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <div className="beauty-category-list" aria-label="Lọc theo danh mục">
          <button
            className={`beauty-category-chip${categoryId === '' ? ' selected' : ''}`}
            onClick={() => setCategoryId('')}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`beauty-category-chip${categoryId === String(category.id) ? ' selected' : ''}`}
              onClick={() => setCategoryId(String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
          <div className="grid-products">
            {products.map((p) => (
              <article key={p.id} className="beauty-product-card card">
                <Link to={`/products/${p.id}`}>
                  <InteractiveImage
                    className="beauty-product-image"
                    src={p.imageUrl || '/cosmetic-placeholder.svg'}
                    alt={p.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = '/cosmetic-placeholder.svg'
                    }}
                  />
                </Link>
                <div className="beauty-product-copy">
                  <span className="beauty-product-category">{p.categoryName || 'Lumi Beauty'}</span>
                  <Link to={`/products/${p.id}`} className="beauty-product-name">{p.name}</Link>
                  <p className="beauty-product-description">{p.description}</p>
                  <div className="beauty-product-price">{formatVND(p.price)}</div>
                  <div className="beauty-product-stock">{p.quantity > 0 ? 'Sẵn sàng giao' : 'Tạm hết hàng'}</div>
                  {!isAdmin && (
                    <button
                      className="btn-primary beauty-add-button"
                      disabled={p.quantity === 0}
                      onClick={() => handleAddToCart(p.id)}
                    >
                      {p.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

