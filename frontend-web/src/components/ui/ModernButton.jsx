import React from 'react';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md',
        outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-primary-500 underline-offset-4 hover:underline hover:text-primary-600',
        success: 'bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow-md',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const ModernButton = React.forwardRef(({ className, variant, size, loading, children, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

ModernButton.displayName = 'ModernButton';

export { ModernButton, buttonVariants };