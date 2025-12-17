import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', title, message, onClose, dismissible = true }) => {
  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
      titleColor: 'text-green-900',
      messageColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: ExclamationCircleIcon,
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      messageColor: 'text-red-800'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: ExclamationCircleIcon,
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-800'
    },
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      icon: InformationCircleIcon,
      iconColor: 'text-sky-500',
      titleColor: 'text-sky-900',
      messageColor: 'text-sky-800'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 animate-slide-in`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>}
          {message && <p className={`text-sm mt-1 ${config.messageColor}`}>{message}</p>}
        </div>
        {dismissible && (
          <button
            onClick={onClose}
            className={`ml-3 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
