import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export function Notification({ type = 'success', message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg
        ${type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
      `}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        
        <p className={`text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}