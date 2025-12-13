import React from 'react';
import { cn } from '../../lib/utils';

const ModernCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md',
      className
    )}
    {...props}
  />
));
ModernCard.displayName = 'ModernCard';

const ModernCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
    {...props}
  />
));
ModernCardHeader.displayName = 'ModernCardHeader';

const ModernCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight text-gray-900', className)}
    {...props}
  />
));
ModernCardTitle.displayName = 'ModernCardTitle';

const ModernCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-base text-gray-600', className)}
    {...props}
  />
));
ModernCardDescription.displayName = 'ModernCardDescription';

const ModernCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
ModernCardContent.displayName = 'ModernCardContent';

const ModernCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
ModernCardFooter.displayName = 'ModernCardFooter';

export {
  ModernCard,
  ModernCardHeader,
  ModernCardFooter,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
};