import type { ReactNode } from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  icon?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

/** Silme ve içe aktarma gibi geri alınamaz işlemlerden önce onay ister. */
export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  icon = 'bi-exclamation-triangle',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="modal-body">
        <div className="confirm-body">
          <span className={`confirm-icon confirm-icon-${variant}`} aria-hidden="true">
            <i className={`bi ${icon}`} />
          </span>
          <div className="confirm-message">{message}</div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn-custom btn-custom-light" onClick={onCancel} autoFocus>
          Vazgeç
        </button>
        <button
          type="button"
          className={`btn-custom ${variant === 'danger' ? 'btn-custom-danger' : 'btn-custom-primary'}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
