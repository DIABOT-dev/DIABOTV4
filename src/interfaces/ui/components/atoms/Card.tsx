import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export default function Card({ children, className, 'data-testid': testId }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm p-4',
        className
      )} 
      data-testid={testId}
    >
      {children}
    </div>
  );
}