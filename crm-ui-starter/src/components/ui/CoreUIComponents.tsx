import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  className?: string
}

/**
 * StatsCard Component
 * Displays a key metric with optional icon, trend, and subtitle
 * Inspired by CoreUI design patterns
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-500',
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        card bg-white border border-gray-200 rounded-lg p-6 
        hover:shadow-lg transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
          {trend && (
            <div
              className={`
                flex items-center gap-1 text-xs font-semibold mt-2
                ${trend.isPositive ? 'text-green-600' : 'text-red-600'}
              `}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 bg-gray-100 rounded-lg ${iconColor}`}>
            <Icon size={24} className="opacity-70" />
          </div>
        )}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

/**
 * ChartCard Component
 * Wrapper for charts with consistent styling
 */
export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className = '',
}) => {
  return (
    <div className={`card bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

interface DataTableProps {
  columns: {
    header: string
    accessor: string
    render?: (value: any, row: any) => React.ReactNode
    className?: string
  }[]
  data: any[]
  striped?: boolean
  hover?: boolean
  bordered?: boolean
  className?: string
  onRowClick?: (row: any) => void
}

/**
 * DataTable Component
 * Responsive data table with optional striping, hover, borders
 */
export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  striped = true,
  hover = true,
  bordered = false,
  className = '',
  onRowClick,
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick?.(row)}
              className={`
                border-b border-gray-100
                ${striped && rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${hover && onRowClick ? 'hover:bg-blue-50 cursor-pointer transition-colors' : ''}
                ${bordered ? 'border-x border-gray-200' : ''}
              `}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-4 py-3 text-gray-700 ${col.className || ''}`}
                >
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Badge Component
 * Status/category indicator with multiple variants
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * Pagination Component
 * Navigation for paginated data
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 mt-4 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        ← Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10 h-10 rounded-md font-medium transition-colors
            ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  )
}

interface AlertProps {
  title?: string
  message: string
  variant?: 'success' | 'warning' | 'error' | 'info'
  closeable?: boolean
  onClose?: () => void
  className?: string
}

/**
 * Alert Component
 * Display important messages to users
 */
export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  closeable = true,
  onClose,
  className = '',
}) => {
  const variantClasses = {
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  }

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className="text-sm mt-1">{message}</p>
      </div>
      {closeable && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

/**
 * LoadingSpinner Component
 * Shows loading state
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'border-blue-500',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={`
        rounded-full border-gray-200 border-t-2 animate-spin
        ${sizeClasses[size]}
        ${color}
        ${className}
      `}
    />
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  color?: string
  showValue?: boolean
  className?: string
}

/**
 * ProgressBar Component
 * Visual progress indicator
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'bg-blue-500',
  showValue = false,
  className = '',
}) => {
  const percentage = (value / max) * 100

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {showValue && <p className="text-sm font-semibold text-gray-900">{percentage.toFixed(0)}%</p>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface AvatarProps {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Avatar Component
 * User profile picture with fallback
 */
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {src ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
    </div>
  )
}

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

/**
 * Tooltip Component
 * Display additional information on hover
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  }

  return (
    <div className={`relative inline-flex group ${className}`}>
      {children}
      <div
        className={`
          absolute hidden group-hover:flex bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap
          ${positionClasses[position]} z-50
        `}
      >
        {content}
      </div>
    </div>
  )
}
