import React from 'react';
import { cn } from '../../lib/utils';

const ModernInput = React.forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  error, 
  icon: Icon, 
  rightIcon: RightIcon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base placeholder-gray-400 transition-all duration-200',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            RightIcon && 'pr-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
            className
          )}
          ref={ref}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <RightIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

ModernInput.displayName = 'ModernInput';

export { ModernInput };