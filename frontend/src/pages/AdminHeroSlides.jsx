import { useEffect, useState } from 'react'
import { adminApi } from '../api/endpoints'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'

const emptySlide = {
  title: '',
  subtitle: '',
  imageUrl: '',
  imageAlt: '',
  caption: '',
  ctaLabel: 'Khám phá sản phẩm',
  ctaLink: '/#catalog',
  displayOrder: 0,
  active: true
}

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([])
  const [slide, setSlide] = useState(emptySlide)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const { showToast } = useToast()

  const loadSlides = () => {
    setLoading(true)
    adminApi.getBannerSlides()
      .then(({ data }) => setSlides(data))
      .catch((requestError) => showToast(requestError.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(loadSlides, [])

  const openNewSlide = () => {
    setSlide({ ...emptySlide, displayOrder: slides.length })
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEditSlide = (item) => {
    setSlide({
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      caption: item.caption || '',
      ctaLabel: item.ctaLabel,
      ctaLink: item.ctaLink,
      displayOrder: item.displayOrder,
      active: item.active
    })
    setEditingId(item.id)
    setError('')
    setShowForm(true)
  }

  const handleUpload = async (event) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một tệp ảnh.')
      input.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh banner không được vượt quá 5 MB.')
      input.value = ''
      return
    }

    setUploading(true)
    setError('')
    try {
      const upload = new FormData()
      upload.append('file', file)
      const { data } = await adminApi.uploadImage(upload)
      setSlide((current) => ({ ...current, imageUrl: data.url }))
      showToast('Tải ảnh banner thành công')
    } catch (requestError) {
      setError(requestError.message || 'Không thể tải ảnh banner')
    } finally {
      setUploading(false)
      input.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...slide,
      displayOrder: Number(slide.displayOrder)
    }

    try {
      if (editingId) {
        await adminApi.updateBannerSlide(editingId, payload)
        showToast('Đã cập nhật banner')
      } else {
        await adminApi.createBannerSlide(payload)
        showToast('Đã thêm banner')
      }
      setShowForm(false)
      loadSlides()
    } catch (requestError) {
      setError(requestError.message || 'Không thể lưu banner')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await adminApi.deleteBannerSlide(pendingDelete.id)
      showToast('Đã xóa banner')
      loadSlides()
    } catch (requestError) {
      showToast(requestError.message, 'error')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <div className="container admin-banners">
      <div className="admin-banners-header">
        <div>
          <span className="eyebrow">TRẢI NGHIỆM TRANG CHỦ</span>
          <h1>Quản lý banner</h1>
          <p className="muted">Chỉnh nội dung, ảnh, thứ tự và trạng thái hiển thị của từng slide.</p>
        </div>
        <button className="btn-primary" onClick={openNewSlide}>+ Thêm banner</button>
      </div>

      {loading ? (
        <p>Đang tải banner...</p>
      ) : slides.length === 0 ? (
        <div className="card admin-banner-empty">Chưa có banner. Thêm một slide để hiển thị ở trang chủ.</div>
      ) : (
        <div className="admin-banner-grid">
          {slides.map((item) => (
            <article key={item.id} className="card admin-banner-card">
              <img src={item.imageUrl} alt={item.imageAlt} />
              <div className="admin-banner-card-copy">
                <div className="admin-banner-card-meta">
                  <span>Thứ tự {item.displayOrder + 1}</span>
                  <span className={item.active ? 'admin-banner-active' : 'admin-banner-inactive'}>
                    {item.active ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
                <div className="admin-banner-actions">
                  <button className="btn-secondary" onClick={() => openEditSlide(item)}>Chỉnh sửa</button>
                  <button className="btn-danger" onClick={() => setPendingDelete(item)}>Xóa</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div className="admin-banner-overlay" onClick={() => setShowForm(false)}>
          <form className="card admin-banner-form" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
            <h2>{editingId ? 'Chỉnh sửa banner' : 'Thêm banner mới'}</h2>
            <label className="form-label">
              Tiêu đề
              <input className="form-input" maxLength={180} value={slide.title}
                onChange={(event) => setSlide({ ...slide, title: event.target.value })} required />
            </label>
            <label className="form-label">
              Mô tả
              <textarea className="form-input" rows={3} value={slide.subtitle}
                onChange={(event) => setSlide({ ...slide, subtitle: event.target.value })} required />
            </label>
            <label className="form-label">
              Tải ảnh (tối đa 5 MB)
              <input className="form-input" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </label>
            {uploading && <p className="muted">Đang tải ảnh...</p>}
            <label className="form-label">
              Hoặc nhập URL ảnh
              <input className="form-input" type="url" value={slide.imageUrl}
                onChange={(event) => setSlide({ ...slide, imageUrl: event.target.value })} required />
            </label>
            {slide.imageUrl && <img className="admin-banner-preview" src={slide.imageUrl} alt={slide.imageAlt || 'Xem trước ảnh banner'} />}
            <label className="form-label">
              Mô tả ảnh (alt)
              <input className="form-input" maxLength={255} value={slide.imageAlt}
                onChange={(event) => setSlide({ ...slide, imageAlt: event.target.value })} required />
            </label>
            <label className="form-label">
              Chú thích trên ảnh
              <input className="form-input" maxLength={255} value={slide.caption}
                onChange={(event) => setSlide({ ...slide, caption: event.target.value })} />
            </label>
            <div className="admin-banner-form-row">
              <label className="form-label">
                Chữ trên nút
                <input className="form-input" maxLength={80} value={slide.ctaLabel}
                  onChange={(event) => setSlide({ ...slide, ctaLabel: event.target.value })} required />
              </label>
              <label className="form-label">
                Đường dẫn nút
                <input className="form-input" value={slide.ctaLink}
                  onChange={(event) => setSlide({ ...slide, ctaLink: event.target.value })} required />
              </label>
            </div>
            <div className="admin-banner-form-row">
              <label className="form-label">
                Thứ tự
                <input className="form-input" type="number" min={0} value={slide.displayOrder}
                  onChange={(event) => setSlide({ ...slide, displayOrder: event.target.value })} required />
              </label>
              <label className="admin-banner-toggle">
                <input type="checkbox" checked={slide.active}
                  onChange={(event) => setSlide({ ...slide, active: event.target.checked })} />
                Hiển thị slide
              </label>
            </div>
            {error && <p className="error-text" role="alert">{error}</p>}
            <div className="admin-banner-form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
              <button className="btn-primary" disabled={saving || uploading}>
                {saving ? 'Đang lưu...' : 'Lưu banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="XÓA BANNER"
        message={`Bạn có chắc muốn xóa banner "${pendingDelete?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
