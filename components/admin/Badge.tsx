import * as React from 'react';
import { cn } from '@/lib/admin/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'purple' | 'pink' | 'cyan' | 'orange';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-transparent',
  secondary: 'bg-lime-50 text-lime-700 border-lime-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  outline: 'bg-white text-gray-700 border-gray-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };