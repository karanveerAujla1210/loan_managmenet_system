import React from 'react'

type Props = {
  label: string
  value: string | number
  subtext?: string
  icon?: string
  trend?: 'up' | 'down'
  trendValue?: string
  backgroundColor?: string
}

export const StatsCard: React.FC<Props> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  trendValue,
  backgroundColor = 'from-blue-50 to-indigo-50'
}) => {
  const trendColor = trend === 'up' ? 'text-success' : 'text-danger'
  const trendIcon = trend === 'up' ? '📈' : '📉'

  return (
    <div className={`bg-gradient-to-br ${backgroundColor} border border-white/40 rounded-2xl p-6 hover:shadow-card-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-body-sm font-medium text-gray-600 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold gradient-primary-text">{value}</p>
            {subtext && <span className="text-sm text-gray-600">{subtext}</span>}
          </div>
          {trendValue && (
            <p className={`text-xs font-bold mt-2 ${trendColor}`}>
              {trendIcon} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
