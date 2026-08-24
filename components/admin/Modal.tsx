import * as React from 'react';
import { cn } from '@/lib/admin/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({ open, isOpen, onClose, title, description, children, footer, size = 'md', className }: ModalProps) => {
  const isVisible = open ?? isOpen ?? false;
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative z-50 w-full rounded-2xl bg-white shadow-xl', sizeClasses[size], className)}>
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
