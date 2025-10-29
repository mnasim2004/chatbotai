import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function SuccessNotification({ message, isVisible, onClose, duration = 4000, type = 'success' }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-800'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-800'
        };
      default:
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-green-800'
        };
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = getIconAndColors();

  return (
    <div className="animate-slide-in-right">
      <div className={`${bgColor} ${borderColor} rounded-xl shadow-2xl border p-4 min-w-[320px] max-w-[400px] backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon size={20} className={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${textColor} font-medium text-sm leading-relaxed`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-5 rounded-full transition-colors duration-200"
          >
            <X size={14} className={`${textColor} opacity-70 hover:opacity-100`} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
          <div className="h-full bg-current opacity-30 animate-progress-bar"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-progress-bar {
          animation: progress-bar ${duration}ms linear;
        }
      `}</style>
    </div>
  );
}
