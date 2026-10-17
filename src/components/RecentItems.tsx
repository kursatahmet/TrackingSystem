import type { TrackedItem } from '../interfaces/item';
import { formatDate } from '../utils/format';
import { TYPE_ICONS, TYPE_LABELS } from '../utils/labels';
import { routeToHash } from '../utils/navigation';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';

interface RecentItemsProps {
  items: TrackedItem[];
  onAdd: () => void;
}

export default function RecentItems({ items, onAdd }: RecentItemsProps) {
  return (
    <div className="card h-100 mb-0">
      <div className="card-header">
        <h2 className="card-title">Son Eklenenler</h2>
        {items.length > 0 && (
          <a href={routeToHash({ page: 'list', type: 'all' })} className="card-header-link">
            Tümünü gör <i className="bi bi-arrow-right" aria-hidden="true" />
          </a>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          compact
          icon="bi-inbox"
          title="Henüz kayıt yok"
          description="İzlemek ya da okumak istediğin ilk filmi, diziyi veya kitabı ekleyerek başla."
          action={
            <button type="button" className="btn-custom btn-custom-primary" onClick={onAdd}>
              <i className="bi bi-plus-lg" aria-hidden="true" /> İlk kaydını ekle
            </button>
          }
        />
      ) : (
        <ul className="transaction-list list-unstyled mb-0">
          {items.map((item) => (
            <li className="transaction-item" key={item.id}>
              <span className="transaction-icon bg-forest-light text-lime" aria-hidden="true">
                <i className={`bi ${TYPE_ICONS[item.type]}`} />
              </span>
              <div className="transaction-info">
                <div className="transaction-name">{item.title}</div>
                <p className="transaction-date">
                  {TYPE_LABELS[item.type]} · {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="transaction-amount">
                <StatusBadge status={item.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
