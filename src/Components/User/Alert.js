import React from 'react';
import { X } from 'lucide-react';

export function Alert({ children, variant = 'info', onClose, className = '' }) {
  const variantStyles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div
      className={`relative border rounded-lg p-4 ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}