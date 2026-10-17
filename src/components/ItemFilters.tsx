import type { SortOption, StatusFilter, ViewMode } from '../interfaces/filters';
import type { TypeFilter } from '../interfaces/navigation';
import { ITEM_STATUSES, ITEM_TYPES, SORT_LABELS, TYPE_LABELS, getStatusLabel } from '../utils/labels';
import { routeToHash } from '../utils/navigation';
import { isItemStatus } from '../utils/validation';

interface ItemFiltersProps {
  type: TypeFilter;
  typeCounts: Record<TypeFilter, number>;
  search: string;
  status: StatusFilter;
  sort: SortOption;
  view: ViewMode;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortOption) => void;
  onViewChange: (value: ViewMode) => void;
}

const TYPE_FILTERS: TypeFilter[] = ['all', ...ITEM_TYPES];
const SORT_OPTIONS = Object.keys(SORT_LABELS) as SortOption[];

/**
 * Liste filtreleri. Tür filtresi sayfa geçişiyle aynıdır: "Film"e tıklamak
 * yan menüdeki "Filmler" sayfasını açar, böylece ikisi her zaman uyumlu kalır.
 */
export default function ItemFilters({
  type,
  typeCounts,
  search,
  status,
  sort,
  view,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onViewChange,
}: ItemFiltersProps) {
  return (
    <div className="table-header-control list-toolbar">
      <nav className="segmented" aria-label="Türe göre filtrele">
        {TYPE_FILTERS.map((filter) => (
          <a
            key={filter}
            href={routeToHash({ page: 'list', type: filter })}
            className={`segmented-item${filter === type ? ' active' : ''}`}
            aria-current={filter === type ? 'page' : undefined}
          >
            {filter === 'all' ? 'Tümü' : TYPE_LABELS[filter]}
            <span className="segmented-count">{typeCounts[filter]}</span>
          </a>
        ))}
      </nav>

      <div className="list-toolbar-controls">
        <div className="table-search-box">
          <i className="bi bi-search table-search-icon" aria-hidden="true" />
          <input
            type="search"
            className="table-search-input"
            placeholder="Başlıkta ara…"
            aria-label="Başlıkta ara"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <select
          className="form-select-custom toolbar-select"
          aria-label="Duruma göre filtrele"
          value={status}
          onChange={(event) => {
            const value = event.target.value;
            onStatusChange(isItemStatus(value) ? value : 'all');
          }}
        >
          <option value="all">Tüm durumlar</option>
          {ITEM_STATUSES.map((itemStatus) => (
            <option key={itemStatus} value={itemStatus}>
              {getStatusLabel(itemStatus)}
            </option>
          ))}
        </select>

        <select
          className="form-select-custom toolbar-select"
          aria-label="Sıralama"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>

        <div className="segmented" role="group" aria-label="Görünüm">
          <button
            type="button"
            className={`segmented-item${view === 'table' ? ' active' : ''}`}
            aria-pressed={view === 'table'}
            aria-label="Tablo görünümü"
            title="Tablo görünümü"
            onClick={() => onViewChange('table')}
          >
            <i className="bi bi-list-ul" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`segmented-item${view === 'cards' ? ' active' : ''}`}
            aria-pressed={view === 'cards'}
            aria-label="Kart görünümü"
            title="Kart görünümü"
            onClick={() => onViewChange('cards')}
          >
            <i className="bi bi-grid-3x2-gap" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
