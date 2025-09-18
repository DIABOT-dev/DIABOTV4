import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  'data-testid'?: string;
}

export default function Input({ 
  size = 'md', 
  className, 
  'data-testid': testId,
  ...props 
}: InputProps) {
  return (
    <input
      className={cn(
        'input',
        `input-${size}`,
        className
      )}
      data-testid={testId}
      {...props}
    />
  );
}