import React from 'react';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FormField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  helperText,
  options,
  rows,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-gray-900 placeholder:text-gray-400';
  const errorClasses = error ? 'border-red-500 bg-red-50' : 'border-gray-300';
  const successClasses = success ? 'border-green-500 bg-green-50' : '';
  const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';

  const inputClasses = `${baseClasses} ${errorClasses} ${successClasses} ${disabledClasses}`;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows || 4}
            className={inputClasses}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={inputClasses}
            {...props}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        )}

        {/* Status icons */}
        {error && (
          <ExclamationCircleIcon className="absolute right-3 top-3 h-5 w-5 text-red-500" />
        )}
        {success && !error && (
          <CheckCircleIcon className="absolute right-3 top-3 h-5 w-5 text-green-500" />
        )}
      </div>

      {/* Helper text */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
