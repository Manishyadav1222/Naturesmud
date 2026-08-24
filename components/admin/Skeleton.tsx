import * as React from 'react';
import { cn } from '@/lib/admin/utils';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('animate-pulse rounded-md bg-gray-200/70', className)} {...props} />;
};

export { Skeleton };