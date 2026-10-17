import type { ItemStatus, TrackedItem } from '../interfaces/item';
import { formatDate } from '../utils/format';
import RatingStars from './RatingStars';
import StatusBadge from './StatusBadge';
import StatusToggle from './StatusToggle';
import TypeBadge from './TypeBadge';

interface ItemCardProps {
  item: TrackedItem;
  onEdit: (item: TrackedItem) => void;
  onDelete: (item: TrackedItem) => void;
  onStatusChange: (item: TrackedItem, status: ItemStatus) => void;
}

export default function ItemCard({ item, onEdit, onDelete, onStatusChange }: ItemCardProps) {
  const meta = [item.creator, item.year].filter(Boolean).join(' · ');

  return (
    <article className="item-card">
      <div className="item-card-badges">
        <TypeBadge type={item.type} />
        <StatusBadge status={item.status} />
      </div>

      <h3 className="item-card-title">{item.title}</h3>
      {meta && <p className="item-card-meta">{meta}</p>}
      <RatingStars rating={item.rating} />
      {item.note && <p className="item-card-note">{item.note}</p>}

      <div className="item-card-status">
        <StatusToggle item={item} onChange={(status) => onStatusChange(item, status)} />
      </div>

      <div className="item-card-footer">
        <span className="item-card-date">
          <i className="bi bi-calendar3" aria-hidden="true" /> {formatDate(item.createdAt)}
        </span>
        <div className="d-flex gap-1">
          <button
            type="button"
            className="table-btn-action"
            title="Düzenle"
            aria-label={`"${item.title}" kaydını düzenle`}
            onClick={() => onEdit(item)}
          >
            <i className="bi bi-pencil" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="table-btn-action delete"
            title="Sil"
            aria-label={`"${item.title}" kaydını sil`}
            onClick={() => onDelete(item)}
          >
            <i className="bi bi-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
