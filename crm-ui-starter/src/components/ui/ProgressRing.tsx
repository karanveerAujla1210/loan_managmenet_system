import React from 'react'

type Props = {
  size?: number
  stroke?: number
  value: number // 0-100
  className?: string
}

export const ProgressRing: React.FC<Props> = ({ size = 48, stroke = 6, value, className = '' }) => {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E6E9EE" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1741FF"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fill="#111827">{`${Math.round(value)}%`}</text>
    </svg>
  )
}

export default ProgressRing
