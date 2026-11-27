import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cartApi, categoryApi, productApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import BeautyHero from '../components/BeautyHero'

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
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let active = true
    categoryApi.getAll()
      .then(({ data }) => {
        if (active) setCategories(data)
      })
      .catch((error) => showToast(error.message || 'Không thể tải danh mục', 'error'))

    return () => {
      active = false
    }
  }, [showToast])

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = window.setTimeout(() => {
      productApi.getAll({
        keyword: keyword.trim() || undefined,
        categoryId: categoryId || undefined,
        size: 24
      })
        .then(({ data }) => {
          if (active) setProducts(data.content)
        })
        .catch((error) => {
          if (active) showToast(error.message || 'Không thể tải danh sách sản phẩm', 'error')
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 220)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [keyword, categoryId, showToast])

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để mua hàng', 'error')
      return
    }

    try {
      await cartApi.addToCart(productId, 1)
      await refreshCart()
      showToast('Đã thêm sản phẩm vào giỏ hàng')
    } catch (error) {
      showToast(error.message || 'Không thể thêm sản phẩm vào giỏ hàng', 'error')
    }
  }

  return (
    <div className="store-page">
      <BeautyHero />

      <section id="catalog" className="beauty-catalog container">
        <div className="beauty-section-heading">
          <div>
            <span className="eyebrow">THE LUMI EDIT</span>
            <h2>Sản phẩm được tuyển chọn</h2>
            <p className="muted">Những món đồ nâng niu chu trình chăm sóc mỗi ngày.</p>
          </div>
          <label className="beauty-search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              className="form-input beauty-search"
              aria-label="Tìm kiếm mỹ phẩm"
              placeholder="Tìm serum, kem dưỡng, son..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
        </div>

        <div className="beauty-category-list" aria-label="Lọc theo danh mục">
          <button
            type="button"
            className={`beauty-category-chip${categoryId === '' ? ' selected' : ''}`}
            onClick={() => setCategoryId('')}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`beauty-category-chip${categoryId === String(category.id) ? ' selected' : ''}`}
              onClick={() => setCategoryId(String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="catalog-state">Đang tải bộ sưu tập...</p>
        ) : products.length === 0 ? (
          <p className="catalog-state">Không tìm thấy sản phẩm phù hợp.</p>
        ) : (
          <motion.div
            className="grid-products"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {products.map((product, index) => (
              <motion.article
                key={product.id}
                className="beauty-product-card"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (index % 4) * 0.055 }}
              >
                <Link className="beauty-product-image-link" to={`/products/${product.id}`}>
                  <img
                    className="beauty-product-image"
                    src={product.imageUrl || '/cosmetic-placeholder.svg'}
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = '/cosmetic-placeholder.svg'
                    }}
                  />
                </Link>
                <div className="beauty-product-copy">
                  <span className="beauty-product-category">
                    {product.categoryName || 'Lumi Beauty'}
                  </span>
                  <Link to={`/products/${product.id}`} className="beauty-product-name">
                    {product.name}
                  </Link>
                  <p className="beauty-product-description">{product.description}</p>
                  <div className="beauty-product-price">{formatVND(product.price)}</div>
                  <div className="beauty-product-stock">
                    {product.quantity > 0 ? 'Sẵn sàng giao' : 'Tạm hết hàng'}
                  </div>
                  {!isAdmin && (
                    <button
                      type="button"
                      className="btn-primary beauty-add-button"
                      disabled={product.quantity === 0}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
