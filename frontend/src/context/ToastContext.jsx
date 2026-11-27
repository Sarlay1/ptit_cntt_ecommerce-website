import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000) // tự động ẩn sau 3 giây theo SRS
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...styles.toast, ...(t.type === 'error' ? styles.error : styles.success) }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast phải được dùng bên trong ToastProvider')
  return ctx
}

const styles = {
  container: {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  toast: {
    minWidth: 260,
    maxWidth: 360,
    padding: '12px 16px',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontSize: 14,
    fontWeight: 500,
    animation: 'fadein 0.2s ease-in'
  },
  success: {
    backgroundColor: '#dcfce7', // xanh lá nhạt
    color: '#166534'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
}
