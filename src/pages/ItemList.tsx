import { useMemo, useState } from 'react';
import type { SortOption, StatusFilter, ViewMode } from '../interfaces/filters';
import type { ItemStatus, TrackedItem } from '../interfaces/item';
import type { TypeFilter } from '../interfaces/navigation';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemTable from '../components/ItemTable';
import PageHeader from '../components/PageHeader';
import { filterItems, sortItems } from '../utils/itemFilters';
import { TYPE_ICONS, TYPE_LABELS, TYPE_PLURAL_LABELS } from '../utils/labels';

interface ItemListProps {
  items: TrackedItem[];
  type: TypeFilter;
  onAdd: () => void;
  onEdit: (item: TrackedItem) => void;
  onDelete: (item: TrackedItem) => void;
  onStatusChange: (item: TrackedItem, status: ItemStatus) => void;
}

const EMPTY_MESSAGES: Record<TypeFilter, { title: string; description: string }> = {
  all: {
    title: 'Listen henüz boş',
    description: 'İzlemek ya da okumak istediğin ilk filmi, diziyi veya kitabı ekleyerek başla.',
  },
  movie: { title: 'Henüz film eklemedin', description: 'İzlediğin ya da izlemek istediğin filmleri buraya ekle.' },
  series: { title: 'Henüz dizi eklemedin', description: 'Takip ettiğin dizileri buraya ekleyerek nerede kaldığını unutma.' },
  book: { title: 'Henüz kitap eklemedin', description: 'Okuduğun ya da okumak istediğin kitapları buraya ekle.' },
};

function getInitialView(): ViewMode {
  return window.matchMedia('(max-width: 767.98px)').matches ? 'cards' : 'table';
}

export default function ItemList({ items, type, onAdd, onEdit, onDelete, onStatusChange }: ItemListProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [view, setView] = useState<ViewMode>(getInitialView);

  const typeCounts = useMemo<Record<TypeFilter, number>>(
    () => ({
      all: items.length,
      movie: items.filter((item) => item.type === 'movie').length,
      series: items.filter((item) => item.type === 'series').length,
      book: items.filter((item) => item.type === 'book').length,
    }),
    [items],
  );

  const visibleItems = useMemo(
    () => sortItems(filterItems(items, { type, status, search }), sort),
    [items, type, status, search, sort],
  );

  const totalInType = typeCounts[type];
  const title = type === 'all' ? 'Tüm Liste' : TYPE_PLURAL_LABELS[type];
  const addLabel = type === 'all' ? 'Yeni Kayıt' : `Yeni ${TYPE_LABELS[type]}`;

  function clearFilters() {
    setSearch('');
    setStatus('all');
  }

  function renderContent() {
    if (totalInType === 0) {
      const message = EMPTY_MESSAGES[type];
      return (
        <EmptyState
          icon={type === 'all' ? 'bi-inbox' : TYPE_ICONS[type]}
          title={message.title}
          description={message.description}
          action={
            <button type="button" className="btn-custom btn-custom-primary" onClick={onAdd}>
              <i className="bi bi-plus-lg" aria-hidden="true" /> {addLabel} Ekle
            </button>
          }
        />
      );
    }

    if (visibleItems.length === 0) {
      return (
        <EmptyState
          icon="bi-search"
          title="Sonuç bulunamadı"
          description="Arama veya filtrelerine uyan kayıt yok. Filtreleri değiştirip tekrar dene."
          action={
            <button type="button" className="btn-custom btn-custom-light" onClick={clearFilters}>
              <i className="bi bi-x-circle" aria-hidden="true" /> Filtreleri temizle
            </button>
          }
        />
      );
    }

    if (view === 'table') {
      return (
        <ItemTable
          items={visibleItems}
          showType={type === 'all'}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      );
    }

    return (
      <div className="item-card-grid">
        {visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={totalInType === 0 ? 'Henüz kayıt yok' : `${totalInType} kayıt`}
        actions={
          <button type="button" className="btn-custom btn-custom-primary" onClick={onAdd}>
            <i className="bi bi-plus-lg" aria-hidden="true" /> {addLabel} Ekle
          </button>
        }
      />

      <section className="table-card-custom" aria-label={`${title} listesi`}>
        <ItemFilters
          type={type}
          typeCounts={typeCounts}
          search={search}
          status={status}
          sort={sort}
          view={view}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onViewChange={setView}
        />

        {renderContent()}

        {visibleItems.length > 0 && (
          <div className="table-footer-control">
            <span className="table-pagination-info" aria-live="polite">
              {visibleItems.length === totalInType
                ? `${totalInType} kayıt gösteriliyor`
                : `${totalInType} kayıttan ${visibleItems.length} tanesi gösteriliyor`}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
