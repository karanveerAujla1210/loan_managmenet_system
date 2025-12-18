import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function EnhancedKPICard({
  title,
  value,
  unit = '',
  change = 0,
  trend = 'up',
  icon: Icon,
  color = 'blue',
  loading = false,
  subtitle = '',
  onClick = null
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    amber: 'bg-amber-50',
    indigo: 'bg-indigo-50',
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
  };

  const trendColorClasses = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
    >
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColorClasses[color]} rounded-full blur-3xl opacity-20 -mr-16 -mt-16`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${bgColorClasses[color]}`}>
              <Icon className={`w-6 h-6 ${textColorClasses[color]}`} />
            </div>
          )}
        </div>

        {/* Value */}
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-3" />
        ) : (
          <div className="mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
          </div>
        )}

        {/* Trend */}
        {change !== 0 && (
          <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg ${trendColorClasses[trend]}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">{Math.abs(change)}%</span>
            <span className="text-xs">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
