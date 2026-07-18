import type { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function FormCard({ title, onSubmit, children, actions }: FormCardProps) {
  return (
    <form onSubmit={onSubmit} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 space-y-4 shadow-xs">
      <h2 className="text-title-medium font-bold text-on-surface">
        {title}
      </h2>
      
      <div className="space-y-4">
        {children}
      </div>

      {actions && (
        <div className="flex gap-2 pt-2">
          {actions}
        </div>
      )}
    </form>
  );
}
