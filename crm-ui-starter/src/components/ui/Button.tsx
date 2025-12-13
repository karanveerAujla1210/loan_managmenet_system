import React from 'react'
import classNames from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button: React.FC<Props> = ({ variant = 'primary', className, children, ...rest }) => {
  const base = 'px-5 py-2 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = {
    primary: 'bg-[#1741FF] text-white hover:bg-[#0F2ECC]',
    secondary: 'border border-gray-300 hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  return (
    <button className={classNames(base, variantClasses[variant], className)} {...rest}>
      {children}
    </button>
  )
}

export default Button
