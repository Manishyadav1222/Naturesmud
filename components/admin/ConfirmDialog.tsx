import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const variantConfig = {
  danger: {
    icon: 'text-red-600 bg-red-50',
    confirmButton: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: 'text-amber-600 bg-amber-50',
    confirmButton: 'bg-amber-600 hover:bg-amber-700',
  },
  info: {
    icon: 'text-primary-600 bg-primary-50',
    confirmButton: 'bg-primary-600 hover:bg-primary-700',
  },
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) => {
  const config = variantConfig[variant];
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.icon}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button className={config.confirmButton} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Please wait...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export { ConfirmDialog };