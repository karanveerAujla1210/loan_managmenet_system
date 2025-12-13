import React, { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 mx-4">
        {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
