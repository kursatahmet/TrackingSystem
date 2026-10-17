import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ImportResult } from './interfaces/backup';
import type { ItemInput, ItemStatus, ItemType, TrackedItem } from './interfaces/item';
import type { Route, TypeFilter } from './interfaces/navigation';
import type { ToastState, ToastVariant } from './interfaces/ui';
import ConfirmModal from './components/ConfirmModal';
import Footer from './components/Footer';
import ItemForm from './components/ItemForm';
import Sidebar from './components/Sidebar';
import ToastMessage from './components/ToastMessage';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/ItemList';
import NotFound from './pages/NotFound';
import * as backupService from './services/backupService';
import * as itemService from './services/itemService';
import { getErrorMessage } from './utils/format';
import { getStatusLabel } from './utils/labels';
import { getRouteTitle, hashToRoute } from './utils/navigation';

type FormState = { mode: 'add'; defaultType?: ItemType } | { mode: 'edit'; item: TrackedItem } | null;

const TOAST_DURATION_MS = 3500;

export default function App() {
  const [items, setItems] = useState<TrackedItem[]>(() => itemService.getAll());
  const [route, setRoute] = useState<Route>(() => hashToRoute(window.location.hash));
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);
  const [formState, setFormState] = useState<FormState>(null);
  const [itemToDelete, setItemToDelete] = useState<TrackedItem | null>(null);
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Sayfa state'ini URL hash'i ile senkron tutar (geri/ileri tuşları ve yenileme için).
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(hashToRoute(window.location.hash));
      setSidebarOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.title = `${getRouteTitle(route)} · İzleOku`;
  }, [route]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  const counts = useMemo<Record<TypeFilter, number>>(
    () => ({
      all: items.length,
      movie: items.filter((item) => item.type === 'movie').length,
      series: items.filter((item) => item.type === 'series').length,
      book: items.filter((item) => item.type === 'book').length,
    }),
    [items],
  );

  /** Bir depolama işlemini çalıştırır, listeyi yeniler ve sonucu bildirim olarak gösterir. */
  function runStorageAction(action: () => void, successMessage: string): boolean {
    try {
      action();
      setItems(itemService.getAll());
      showToast(successMessage);
      return true;
    } catch (error) {
      showToast(getErrorMessage(error), 'danger');
      return false;
    }
  }

  // --- CRUD işleyicileri ---------------------------------------------------

  function openAddForm() {
    const defaultType = route.page === 'list' && route.type !== 'all' ? route.type : undefined;
    setFormState({ mode: 'add', defaultType });
  }

  function handleFormSubmit(input: ItemInput) {
    const saved =
      formState?.mode === 'edit'
        ? runStorageAction(() => itemService.update(formState.item.id, input), `"${input.title}" güncellendi.`)
        : runStorageAction(() => itemService.add(input), `"${input.title}" eklendi.`);
    if (saved) setFormState(null);
  }

  function handleStatusChange(item: TrackedItem, status: ItemStatus) {
    runStorageAction(
      () => itemService.update(item.id, { status }),
      `"${item.title}" → ${getStatusLabel(status)}`,
    );
  }

  function handleDeleteConfirm() {
    if (!itemToDelete) return;
    const { id, title } = itemToDelete;
    runStorageAction(() => itemService.remove(id), `"${title}" silindi.`);
    setItemToDelete(null);
  }

  // --- Yedekleme -----------------------------------------------------------

  function handleExport() {
    if (items.length === 0) {
      showToast('Dışa aktarılacak kayıt yok.', 'info');
      return;
    }
    backupService.exportToFile(items);
    showToast(`${items.length} kayıt JSON dosyası olarak indirildi.`);
  }

  async function handleImportFile(file: File) {
    try {
      setPendingImport(await backupService.readBackupFile(file));
    } catch (error) {
      showToast(getErrorMessage(error), 'danger');
    }
  }

  function handleImportConfirm() {
    if (!pendingImport) return;
    const { items: importedItems, skipped } = pendingImport;
    const skippedNote = skipped > 0 ? ` (${skipped} geçersiz kayıt atlandı)` : '';
    runStorageAction(
      () => itemService.replaceAll(importedItems),
      `${importedItems.length} kayıt içe aktarıldı${skippedNote}.`,
    );
    setPendingImport(null);
  }

  // --- Görünüm -------------------------------------------------------------

  function renderPage() {
    switch (route.page) {
      case 'dashboard':
        return <Dashboard items={items} onAdd={openAddForm} />;
      case 'list':
        return (
          <ItemList
            items={items}
            type={route.type}
            onAdd={openAddForm}
            onEdit={(item) => setFormState({ mode: 'edit', item })}
            onDelete={setItemToDelete}
            onStatusChange={handleStatusChange}
          />
        );
      case 'not-found':
        return <NotFound />;
    }
  }

  return (
    <div className={`app-shell${isSidebarMinimized ? ' sidebar-minimized' : ''}`}>
      <Sidebar route={route} counts={counts} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      {isSidebarOpen && <div className="sidebar-overlay show" aria-hidden="true" onClick={() => setSidebarOpen(false)} />}

      <div className="main-wrapper">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          isSidebarMinimized={isSidebarMinimized}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          onToggleMinimize={() => setSidebarMinimized((minimized) => !minimized)}
          onAdd={openAddForm}
          onExport={handleExport}
          onImportFile={handleImportFile}
        />
        <main className="page-content">{renderPage()}</main>
        <Footer />
      </div>

      {formState && (
        <ItemForm
          key={formState.mode === 'edit' ? formState.item.id : 'new'}
          item={formState.mode === 'edit' ? formState.item : undefined}
          defaultType={formState.mode === 'add' ? formState.defaultType : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormState(null)}
        />
      )}

      {itemToDelete && (
        <ConfirmModal
          title="Kaydı sil"
          icon="bi-trash"
          confirmLabel="Evet, sil"
          message={
            <>
              <strong>"{itemToDelete.title}"</strong> kaydını silmek istediğine emin misin? Bu işlem geri alınamaz.
            </>
          }
          onConfirm={handleDeleteConfirm}
          onCancel={() => setItemToDelete(null)}
        />
      )}

      {pendingImport && (
        <ConfirmModal
          title="Yedeği içe aktar"
          icon="bi-upload"
          variant="primary"
          confirmLabel="İçe aktar"
          message={
            <>
              <p className="mb-2">
                Dosyada <strong>{pendingImport.items.length}</strong> geçerli kayıt bulundu
                {pendingImport.skipped > 0 && <> ({pendingImport.skipped} geçersiz kayıt atlanacak)</>}.
              </p>
              <p className="mb-0">
                İçe aktarma, mevcut <strong>{items.length}</strong> kaydının yerini alacak. Önce mevcut verilerini
                dışa aktarman önerilir.
              </p>
            </>
          }
          onConfirm={handleImportConfirm}
          onCancel={() => setPendingImport(null)}
        />
      )}

      <ToastMessage toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
