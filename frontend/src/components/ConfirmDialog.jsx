export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'ĐỒNG Ý', cancelText = 'HỦY BỎ' }) {
  if (!open) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">{title}</div>
        <div className="confirm-dialog-body">{message}</div>
        <div className="confirm-dialog-footer">
          <button className="confirm-dialog-cancel" onClick={onCancel}>{cancelText}</button>
          <button className="confirm-dialog-confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
