import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'sky',
  loading = false,
  onClick
}) => {
  const colorClasses = {
    sky: 'bg-sky-50 text-sky-600 border-sky-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const iconBgClasses = {
    sky: 'bg-sky-100 text-sky-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div
      onClick={onClick}
      className={`card card-hover ${colorClasses[color]} cursor-pointer group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center mt-2 text-sm">
              {trend === 'up' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${iconBgClasses[color]} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
