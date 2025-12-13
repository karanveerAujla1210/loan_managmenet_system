import React from 'react'

type Props = {
  title: string
  value: React.ReactNode
  delta?: string
  spark?: React.ReactNode
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export const Kpi: React.FC<Props> = ({ title, value, delta, spark, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary-light border-primary/20',
    success: 'from-success/10 to-emerald-50 border-success/20',
    warning: 'from-warning/10 to-orange-50 border-warning/20',
    danger: 'from-danger/10 to-red-50 border-danger/20'
  }

  const iconBgColors = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warm',
    danger: 'bg-danger'
  }

  return (
    <div className={`card-interactive bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-body-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">{value}</p>
        </div>
        {icon && (
          <div className={`${iconBgColors[color]} rounded-xl p-3 text-white text-xl`}>
            {icon}
          </div>
        )}
      </div>
      {(delta || spark) && (
        <div className="flex items-center justify-between pt-3 border-t border-white/40">
          {delta && <span className="text-xs font-semibold text-green-600">{delta}</span>}
          {spark && <div className="text-sm">{spark}</div>}
        </div>
      )}
    </div>
  )
}

export default Kpi
