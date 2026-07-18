import type { ReactNode } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}

export function BaseModal({ isOpen, onClose, title, children }: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Body */}
      <div className="relative bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.4,0,0.2,1)] md:animate-none">
        {/* Mobile drag indicator */}
        <div className="w-12 h-1 bg-surface-container rounded-full mx-auto mb-4 md:hidden" />

        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="space-y-1 min-w-0 flex-1">
            {typeof title === 'string' ? (
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate">
                {title}
              </h3>
            ) : (
              title
            )}
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container active:scale-90 transition-transform cursor-pointer shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
