import React from 'react'

type Props = {
  size?: number
  stroke?: number
  value: number // 0-100
  className?: string
  label?: string
  color?: 'primary' | 'success' | 'warning'
}

export const ProgressRing: React.FC<Props> = ({ 
  size = 120, 
  stroke = 8, 
  value, 
  className = '', 
  label,
  color = 'primary'
}) => {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  
  const colorMap = {
    primary: '#1741FF',
    success: '#22C55E',
    warning: '#F59E0B'
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative inline-flex">
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorMap[color]} />
              <stop offset="100%" stopColor={colorMap[color]} opacity="0.6" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{Math.round(value)}%</span>
          {label && <span className="text-xs text-gray-600 mt-1">{label}</span>}
        </div>
      </div>
    </div>
  )
}

export default ProgressRing
