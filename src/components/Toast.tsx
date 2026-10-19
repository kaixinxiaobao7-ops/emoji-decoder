import type { ToastData } from '../game/types';

interface ToastProps {
  toast: ToastData | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;
  return (
    <div className={`toast show${toast.type === 'error' ? ' err' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon">{toast.type === 'error' ? '!' : '✦'}</span>
      <span>{toast.message}</span>
    </div>
  );
}
