import React from 'react'

type Item = {
  id: string | number
  title: string
  when?: string
  description?: string
  icon?: string
  type?: 'success' | 'warning' | 'info' | 'default'
}

type Props = {
  items: Item[]
}

export const Timeline: React.FC<Props> = ({ items }) => {
  const iconColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
    default: 'bg-primary'
  }

  const timelineIcons = {
    success: '✓',
    warning: '⚠',
    info: 'ℹ',
    default: '•'
  }

  return (
    <ol className="relative">
      {items.map((it, idx) => {
        const type = it.type || 'default'
        return (
          <li key={it.id} className="mb-6 ml-6 animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
            <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ${iconColors[type]} ring-4 ring-white shadow-md text-white font-bold text-sm`}>
              {it.icon || timelineIcons[type]}
            </span>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {it.when && <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{it.when}</span>}
                <h4 className="text-sm font-bold text-gray-900 mt-1">{it.title}</h4>
                {it.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{it.description}</p>}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default Timeline
