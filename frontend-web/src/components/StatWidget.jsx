import React from 'react';
import Card from './Card';

const StatWidget = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100'
  };
  
  return (
    <Card className="p-4">
      <div className="flex items-center">
        {icon && (
          <div className={`p-2 rounded-lg ${colors[color]} mr-4`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

export default StatWidget;