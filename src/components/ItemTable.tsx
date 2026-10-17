import type { ItemStatus, TrackedItem } from '../interfaces/item';
import { formatDate } from '../utils/format';
import { getCreatorLabel } from '../utils/labels';
import RatingStars from './RatingStars';
import StatusSelect from './StatusSelect';
import TypeBadge from './TypeBadge';

interface ItemTableProps {
  items: TrackedItem[];
  showType: boolean;
  onEdit: (item: TrackedItem) => void;
  onDelete: (item: TrackedItem) => void;
  onStatusChange: (item: TrackedItem, status: ItemStatus) => void;
}

export default function ItemTable({ items, showType, onEdit, onDelete, onStatusChange }: ItemTableProps) {
  return (
    <div className="table-responsive">
      <table className="table-custom">
        <thead>
          <tr>
            <th scope="col">Başlık</th>
            {showType && <th scope="col">Tür</th>}
            <th scope="col">Yıl</th>
            <th scope="col">Puan</th>
            <th scope="col">Durum</th>
            <th scope="col">Eklenme</th>
            <th scope="col" className="text-center">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="cell-title">
                <div className="table-item-title">{item.title}</div>
                {item.creator && (
                  <div className="table-user-sub">
                    {getCreatorLabel(item.type)}: {item.creator}
                  </div>
                )}
                {item.note && (
                  <div className="table-note" title={item.note}>
                    <i className="bi bi-sticky" aria-hidden="true" /> {item.note}
                  </div>
                )}
              </td>
              {showType && (
                <td>
                  <TypeBadge type={item.type} />
                </td>
              )}
              <td>{item.year ?? <span className="text-muted-green">—</span>}</td>
              <td>
                <RatingStars rating={item.rating} />
              </td>
              <td>
                <StatusSelect item={item} onChange={(status) => onStatusChange(item, status)} />
              </td>
              <td className="text-muted-green">{formatDate(item.createdAt)}</td>
              <td>
                <div className="d-flex justify-content-center gap-1">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
