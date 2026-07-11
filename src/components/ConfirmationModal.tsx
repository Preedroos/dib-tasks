

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-xl z-10 transform transition-all border border-outline-variant/20">
        {/* Icon & Title area */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex items-center gap-3 mb-2">
            {variant === 'danger' ? (
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-[22px]">info</span>
              </div>
            )}
            <h3 className="text-lg font-bold text-on-surface">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold border border-outline-variant/30 transition-all cursor-pointer active:scale-95 text-center"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer active:scale-95 text-center ${variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm'
                : 'bg-primary hover:bg-primary-container active:bg-primary text-on-primary shadow-sm'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
