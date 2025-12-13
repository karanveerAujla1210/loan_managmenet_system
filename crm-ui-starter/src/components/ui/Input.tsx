import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<Props> = ({ className = '', ...rest }) => {
  return (
    <input
      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...rest}
    />
  )
}

export default Input
