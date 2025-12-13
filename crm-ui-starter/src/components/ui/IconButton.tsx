import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode
  label?: string
}

export const IconButton: React.FC<Props> = ({ icon, label, className = '', ...rest }) => {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      {...rest}
    >
      {icon}
    </button>
  )
}

export default IconButton
