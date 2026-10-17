import { useRef, type ChangeEvent } from 'react';
import { routeToPath } from '../utils/navigation';
import Logo from './Logo';

interface TopbarProps {
  isSidebarOpen: boolean;
  isSidebarMinimized: boolean;
  onToggleSidebar: () => void;
  onToggleMinimize: () => void;
  onAdd: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
}

export default function Topbar({
  isSidebarOpen,
  isSidebarMinimized,
  onToggleSidebar,
  onToggleMinimize,
  onAdd,
  onExport,
  onImportFile,
}: TopbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Aynı dosya tekrar seçilebilsin diye değer sıfırlanır.
    event.target.value = '';
    if (file) onImportFile(file);
  }

  const minimizeLabel = isSidebarMinimized ? 'Yan menüyü genişlet' : 'Yan menüyü daralt';

  return (
    <header className="navbar-custom">
      <div className="navbar-left">
        <button
          type="button"
          className="btn-desktop-toggle d-none d-xl-flex align-items-center justify-content-center"
          aria-label={minimizeLabel}
          title={minimizeLabel}
          onClick={onToggleMinimize}
        >
          <i className={`bi ${isSidebarMinimized ? 'bi-chevron-bar-right' : 'bi-chevron-bar-left'}`} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="sidebar-toggle-btn"
          aria-label="Menüyü aç"
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list" aria-hidden="true" />
        </button>
        <a href={routeToPath({ page: 'dashboard' })} className="navbar-brand-mobile d-xl-none">
          <Logo size="sm" />
        </a>
        <button type="button" className="btn-quick-action" onClick={onAdd} aria-label="Yeni kayıt ekle">
          <i className="bi bi-plus-lg" aria-hidden="true" />
          <span className="d-none d-sm-inline">Yeni Kayıt</span>
        </button>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="btn-table-action"
          title="Tüm veriyi JSON dosyası olarak indir"
          aria-label="Dışa aktar"
          onClick={onExport}
        >
          <i className="bi bi-download" aria-hidden="true" />
          <span className="d-none d-md-inline">Dışa Aktar</span>
        </button>
        <button
          type="button"
          className="btn-table-action"
          title="JSON yedek dosyasından geri yükle"
          aria-label="İçe aktar"
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="bi bi-upload" aria-hidden="true" />
          <span className="d-none d-md-inline">İçe Aktar</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="d-none"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
}
