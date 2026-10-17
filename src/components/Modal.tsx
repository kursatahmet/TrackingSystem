import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  onClose: () => void;
  /** .modal-body ve .modal-footer içeriği. */
  children: ReactNode;
  size?: 'lg';
  /** false ise arka plana tıklamak modalı kapatmaz (formlarda veri kaybını önler). */
  closeOnBackdrop?: boolean;
}

/**
 * Bootstrap modal görünümünü kullanan, React state'i ile açılıp kapanan modal.
 * Bootstrap'in JavaScript dosyasına ihtiyaç duymaz. Esc tuşuyla kapanır.
 */
export default function Modal({ title, onClose, children, size, closeOnBackdrop = true }: ModalProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, []);

  return createPortal(
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => {
          if (closeOnBackdrop && event.target === event.currentTarget) onClose();
        }}
      >
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable${size ? ` modal-${size}` : ''}`}>
          <div className="modal-content modal-content-custom">
            <div className="modal-header">
              <h2 className="modal-title" id={titleId}>
                {title}
              </h2>
              <button type="button" className="btn-close" aria-label="Kapat" onClick={onClose} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
