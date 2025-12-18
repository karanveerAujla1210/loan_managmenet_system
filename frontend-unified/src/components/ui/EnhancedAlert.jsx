import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function EnhancedAlert({
  type = 'info',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  action = null
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      accentColor: 'bg-green-100'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      accentColor: 'bg-red-100'
    },
    warning: {
      icon: ExclamationIcon,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
      accentColor: 'bg-amber-100'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      accentColor: 'bg-blue-100'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4 shadow-sm`}>
      <div className=\"flex items-start space-x-4\">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.accentColor} rounded-lg p-2`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className=\"flex-1\">
          {title && (
            <h3 className={`text-sm font-semibold ${config.textColor} mb-1`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-sm ${config.textColor} opacity-90`}>
              {message}
            </p>
          )}
          {action && (
            <div className=\"mt-3\">
              {action}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
        >
          <XMarkIcon className=\"w-5 h-5\" />
        </button>
      </div>
    </div>
  );
}
