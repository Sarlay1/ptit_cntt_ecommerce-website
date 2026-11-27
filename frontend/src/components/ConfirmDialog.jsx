export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'ĐỒNG Ý', cancelText = 'HỦY BỎ' }) {
  if (!open) return null

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>{title}</div>
        <div style={styles.body}>{message}</div>
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onCancel}>{cancelText}</button>
          <button style={styles.confirmBtn} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
  },
  dialog: {
    width: 400, maxWidth: '90vw', backgroundColor: '#fff', borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden'
  },
  header: {
    padding: '16px 20px', fontWeight: 700, fontSize: 16,
    borderBottom: '1px solid #eee', textAlign: 'center', color: '#111827'
  },
  body: {
    padding: '20px', fontSize: 14, color: '#374151', lineHeight: 1.6, textAlign: 'center'
  },
  footer: {
    display: 'flex', borderTop: '1px solid #eee'
  },
  cancelBtn: {
    flex: 1, padding: '12px', border: 'none', background: '#f3f4f6',
    cursor: 'pointer', fontWeight: 600, color: '#374151'
  },
  confirmBtn: {
    flex: 1, padding: '12px', border: 'none', background: '#dc2626',
    cursor: 'pointer', fontWeight: 600, color: '#fff'
  }
}
