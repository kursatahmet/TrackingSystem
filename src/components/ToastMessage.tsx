import type { ToastState, ToastVariant } from '../interfaces/ui';

const TOAST_ICONS: Record<ToastVariant, string> = {
  success: 'bi-check-circle-fill',
  danger: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};

interface ToastMessageProps {
  toast: ToastState | null;
  onClose: () => void;
}

/** İşlem sonrası kısa bildirim. Ekran okuyucular için canlı bölge her zaman sayfadadır. */
export default function ToastMessage({ toast, onClose }: ToastMessageProps) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`alert-custom alert-custom-${toast.variant} toast-custom`}>
          <i className={`bi ${TOAST_ICONS[toast.variant]} alert-custom-icon`} aria-hidden="true" />
          <div className="alert-custom-content">{toast.message}</div>
          <button type="button" className="alert-custom-close" aria-label="Bildirimi kapat" onClick={onClose}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
