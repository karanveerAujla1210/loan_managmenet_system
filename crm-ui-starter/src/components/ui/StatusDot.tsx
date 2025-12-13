import React from 'react'

type Props = {
  size?: number
  color?: 'green' | 'red' | 'yellow' | 'gray' | 'blue'
  className?: string
}

export const StatusDot: React.FC<Props> = ({ size = 10, color = 'gray', className = '' }) => {
  const bg = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-400',
    blue: 'bg-blue-500'
  }[color]

  return <span className={`${bg} inline-block rounded-full`} style={{ width: size, height: size }} aria-hidden="true" />
}

export default StatusDot
