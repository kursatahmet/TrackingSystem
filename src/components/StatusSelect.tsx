import type { ItemStatus, TrackedItem } from '../interfaces/item';
import { ITEM_STATUSES, getStatusLabel } from '../utils/labels';
import { isItemStatus } from '../utils/validation';

interface StatusSelectProps {
  item: TrackedItem;
  onChange: (status: ItemStatus) => void;
}

/** Rozet görünümlü açılır menü: tablodan durumu tek tıkla değiştirmek için. */
export default function StatusSelect({ item, onChange }: StatusSelectProps) {
  return (
    <select
      className={`status-select status-${item.status}`}
      value={item.status}
      aria-label={`"${item.title}" durumunu değiştir`}
      onChange={(event) => {
        if (isItemStatus(event.target.value)) onChange(event.target.value);
      }}
    >
      {ITEM_STATUSES.map((status) => (
        <option key={status} value={status}>
          {getStatusLabel(status)}
        </option>
      ))}
    </select>
  );
}
