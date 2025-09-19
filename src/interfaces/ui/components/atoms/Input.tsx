import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error';
  'data-testid'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  size = 'md', 
  variant = 'default',
  className, 
  'data-testid': testId,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base', 
    lg: 'h-12 px-4 text-lg'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary focus:ring-primary',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500'
  };

  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-white transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
        'disabled:bg-gray-50 disabled:text-gray-500',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      data-testid={testId}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;