import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search';
  'data-testid'?: string;
}

export default function Input({ 
  size = 'md', 
  variant = 'default',
  className, 
  'data-testid': testId,
  ...props 
}: InputProps) {
  return (
    <input
      className={cn(
        'input',
        `input-${size}`,
        variant === 'search' && 'pl-10',
        className
      )}
      data-testid={testId}
      {...props}
    />
  );
}