import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPIWidget = ({ 
  title, 
  value, 
  previousValue, 
  format = 'number', 
  icon: Icon,
  color = 'blue' 
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    if (format === 'percentage') {
      return `${val.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const getTrend = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    if (Math.abs(change) < 0.1) return { type: 'neutral', value: 0 };
    return {
      type: change > 0 ? 'up' : 'down',
      value: Math.abs(change)
    };
  };

  const trend = getTrend();
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900'
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-8 w-8" />}
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold">{formatValue(value)}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.type === 'up' ? 'text-green-600' : 
            trend.type === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend.type === 'up' && <TrendingUp className="h-4 w-4" />}
            {trend.type === 'down' && <TrendingDown className="h-4 w-4" />}
            {trend.type === 'neutral' && <Minus className="h-4 w-4" />}
            <span>{trend.value.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIWidget;