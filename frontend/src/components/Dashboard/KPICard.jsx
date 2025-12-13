import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ModernCard, ModernCardContent } from '../ui/ModernCard';
import { cn, formatCurrency } from '../../lib/utils';

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage', 
  trend = 'neutral',
  icon: Icon,
  color = 'primary',
  loading = false,
  format = 'number'
}) => {
  const formatValue = (val) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percentage') return `${val}%`;
    return val?.toLocaleString() || '0';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getColorClasses = () => {
    const colors = {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-green-50 text-green-600',
      warning: 'bg-yellow-50 text-yellow-600',
      error: 'bg-red-50 text-red-600',
      info: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
    };
    return colors[color] || colors.primary;
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <ModernCard className="p-6">
        <ModernCardContent className="p-0">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </ModernCardContent>
      </ModernCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <ModernCard className="p-6 hover:shadow-lg transition-all duration-200">
        <ModernCardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            {Icon && (
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', getColorClasses())}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            
            {change !== undefined && (
              <div className={cn('flex items-center space-x-1 text-sm font-medium', getTrendColor())}>
                <TrendIcon className="w-4 h-4" />
                <span>
                  {changeType === 'percentage' ? `${change}%` : formatValue(change)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-3xl font-semibold text-gray-900">
              {formatValue(value)}
            </h3>
            <p className="text-base text-gray-600">{title}</p>
          </div>
        </ModernCardContent>
      </ModernCard>
    </motion.div>
  );
};

export default KPICard;