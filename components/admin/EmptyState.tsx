import * as React from 'react';
import { cn } from '@/lib/admin/utils';
import { Button, ButtonProps } from './Button';

export interface EmptyStateActionObject {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: ButtonProps['variant'];
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode | EmptyStateActionObject;
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  let actionContent: React.ReactNode = null;
  if (action) {
    if (React.isValidElement(action)) {
      actionContent = action;
    } else if (typeof action === 'object' && 'label' in (action as any)) {
      const actObj = action as EmptyStateActionObject;
      actionContent = (
        <Button onClick={actObj.onClick} variant={actObj.variant || 'primary'}>
          {actObj.label}
        </Button>
      );
    } else {
      actionContent = action as React.ReactNode;
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 px-6 py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {actionContent && <div className="mt-6">{actionContent}</div>}
    </div>
  );
};

export { EmptyState };