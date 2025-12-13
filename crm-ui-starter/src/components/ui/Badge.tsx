import React from 'react'

type Props = {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export const Badge: React.FC<Props> = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium'
  const color = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-800',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700'
  }[variant]

  return <span className={`${base} ${color} ${className}`}>{children}</span>
}

export default Badge
