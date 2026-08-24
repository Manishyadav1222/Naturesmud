import * as React from 'react';
import { cn } from '@/lib/admin/utils';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  subtitle?: string;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, description, subtitle, trend, className }: StatCardProps) => {
  const isPositive = trend?.positive ?? (trend ? trend.value >= 0 : true);
  const displayDesc = description || subtitle;
  return (
    <Card className={cn('relative overflow-hidden p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            {icon}
          </div>
        )}
      </div>
      {(displayDesc || trend) && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              )}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
              {trend.label && <span className="text-gray-400">vs {trend.label}</span>}
            </span>
          )}
          {displayDesc && <span className="text-gray-500">{displayDesc}</span>}
        </div>
      )}
    </Card>
  );
};

export { StatCard };