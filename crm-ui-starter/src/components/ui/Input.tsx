import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: string
  variant?: 'default' | 'filled'
}

export const Input: React.FC<Props> = ({ className = '', icon, variant = 'default', ...rest }) => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg font-medium transition-all duration-300'
  
  const variantClasses = {
    default: 'border-2 border-medium-gray focus:border-primary focus:ring-2 focus:ring-primary/20',
    filled: 'bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20'
  }

  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-3 text-lg">{icon}</span>}
      <input
        className={`${baseClasses} ${variantClasses[variant]} ${icon ? 'pl-10' : ''} focus:outline-none placeholder-gray-500 ${className}`}
        {...rest}
      />
    </div>
  )
}

export default Input
