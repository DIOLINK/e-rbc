type AlertVariant = 'error' | 'success' | 'warning';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  onClose?: () => void;
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'bg-red-50 border-red-400 text-red-700',
  success: 'bg-green-50 border-green-400 text-green-700',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
};

export function Alert({ variant, message, onClose }: AlertProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${variantClasses[variant]}`}
      role="alert"
    >
      <span className="text-sm">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current opacity-50 hover:opacity-100"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
