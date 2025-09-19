"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  'data-testid'?: string;
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  'data-testid': testId 
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-l-4 border-red-400 text-red-800';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-400 text-blue-800';
      default:
        return 'bg-green-50 border-l-4 border-green-400 text-green-800';
    }
  };

  return (
    <div 
      className={cn(
        'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm',
        getStyles()
      )}
      data-testid={testId}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="ml-3 text-lg leading-none opacity-70 hover:opacity-100"
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
    </div>
  );
}