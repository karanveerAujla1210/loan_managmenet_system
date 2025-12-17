import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const StatusBadge = ({ status, label, size = 'md' }) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: CheckCircleIcon,
      dot: 'bg-green-500'
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: XCircleIcon,
      dot: 'bg-gray-500'
    },
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      icon: ClockIcon,
      dot: 'bg-amber-500'
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: ExclamationCircleIcon,
      dot: 'bg-red-500'
    },
    warning: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: ExclamationCircleIcon,
      dot: 'bg-orange-500'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${config.bg} ${config.text} rounded-full font-medium ${sizeClasses[size]}`}>
      <div className={`h-2 w-2 rounded-full ${config.dot}`} />
      <span>{label || status}</span>
    </div>
  );
};

export default StatusBadge;
