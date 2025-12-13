import React, { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

export const Modal: React.FC<Props> = ({ open, onClose, title, subtitle, children, size = 'md', icon }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'auto'
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className={`card-elevated border border-white/40 w-full ${sizeClasses[size]} shadow-card-lg animate-fadeInUp`}>
        {/* Header */}
        {title && (
          <div className="bg-gradient-to-r from-primary/10 to-accent-purple/10 px-6 py-4 border-b border-white/20 flex items-start justify-between">
            <div className="flex items-start gap-4">
              {icon && <span className="text-2xl mt-1">{icon}</span>}
              <div>
                <h3 className="text-heading-md font-display font-bold text-dark-gray">{title}</h3>
                {subtitle && <p className="text-body-sm text-gray-600 mt-1">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
