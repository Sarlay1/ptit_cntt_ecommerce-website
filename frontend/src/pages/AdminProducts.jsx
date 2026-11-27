import { useEffect, useState } from 'react'
import { productApi, categoryApi, adminApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const emptyForm = { name: '', description: '', imageUrl: '', price: '', quantity: '', categoryId: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const { showToast } = useToast()

  const loadData = () => {
    setLoading(true)
    Promise.all([productApi.getAll({ size: 100 }), categoryApi.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.content)
        setCategories(cRes.data)
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  const openCreateForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      price: p.price,
      quantity: p.quantity,
      categoryId: p.categoryId || ''
    })
    setEditingId(p.id)
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      categoryId: form.categoryId ? Number(form.categoryId) : null
    }
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, payload)
        showToast('Cập nhật sản phẩm thành công')
      } else {
        await adminApi.createProduct(payload)
        showToast('Thêm sản phẩm thành công')
      }
      setShowForm(false)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      await adminApi.deleteProduct(confirmDelete.id)
      showToast('Đã xóa sản phẩm')
      loadData()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleImageUpload = async (event) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh.')
      input.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh sản phẩm không được vượt quá 5 MB.')
      input.value = ''
      return
    }

    setError('')
    setUploadingImage(true)
    try {
      const upload = new FormData()
      upload.append('file', file)
      const { data } = await adminApi.uploadImage(upload)
      setForm((current) => ({ ...current, imageUrl: data.url }))
      showToast('Tải ảnh sản phẩm thành công')
    } catch (uploadError) {
      setError(uploadError.message || 'Không thể tải ảnh sản phẩm')
    } finally {
      setUploadingImage(false)
      input.value = ''
    }
  }

  return (
    <div className="container">
      <div style={styles.header}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Quản lý sản phẩm</h1>
        <button className="btn-primary" onClick={openCreateForm}>+ Thêm sản phẩm</button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="card" style={{ padding: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.imageUrl} alt={p.name} style={styles.thumb} /></td>
                  <td>{p.name}</td>
                  <td>{p.categoryName || '-'}</td>
                  <td>{formatVND(p.price)}</td>
                  <td>{p.quantity}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" onClick={() => openEditForm(p)}>Sửa</button>
                    <button className="btn-danger" onClick={() => setConfirmDelete(p)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <form className="card" style={styles.formCard} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">Tên sản phẩm</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">Mô tả</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">
                Tải ảnh sản phẩm (JPG, PNG, WEBP, GIF · tối đa 5 MB)
                <input
                  className="form-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && <p className="muted">Đang tải ảnh lên...</p>}
              <label className="form-label" style={{ marginTop: 12 }}>Hoặc nhập URL hình ảnh</label>
              <input
                className="form-input"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Xem trước ảnh sản phẩm"
                  style={styles.imagePreview}
                  onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
                  onLoad={(event) => { event.currentTarget.style.visibility = 'visible' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Giá (VND)</label>
                <input className="form-input" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Số lượng tồn kho</label>
                <input className="form-input" type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">Danh mục</label>
              <select className="form-input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">-- Không thuộc danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {error && <div className="error-text">{error}</div>}

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Hủy</button>
              <button className="btn-primary" style={{ flex: 1 }}>{editingId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="XÁC NHẬN XÓA SẢN PHẨM"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' },
  thumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 6 },
  imagePreview: { display: 'block', width: 120, height: 120, marginTop: 10, borderRadius: 8, objectFit: 'cover', background: '#f5e8e5' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 },
  formCard: { width: 480, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 28 }
}
