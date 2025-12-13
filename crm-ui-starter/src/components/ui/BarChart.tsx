import React from 'react'

type BarChartData = {
  label: string
  value: number
  maxValue?: number
  color?: string
}

type Props = {
  data: BarChartData[]
  title?: string
  showValues?: boolean
}

export const BarChart: React.FC<Props> = ({ data, title, showValues = true }) => {
  const maxValue = Math.max(...data.map(d => d.maxValue || d.value))
  
  return (
    <div>
      {title && <h3 className="text-heading-sm font-bold mb-4 text-gray-900">{title}</h3>}
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100
          const color = item.color || 'bg-gradient-primary'
          
          return (
            <div key={idx} className="animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                {showValues && <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700 ease-out shadow-glow-blue`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BarChart
