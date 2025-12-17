import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className = '', padding = true, ...props }) => {
  return (
    <div 
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-2xl font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={clsx(className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;

export { Card, CardHeader, CardTitle, CardContent };
export default Card;
