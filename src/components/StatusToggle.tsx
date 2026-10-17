import type { ItemStatus, TrackedItem } from '../interfaces/item';
import { ITEM_STATUSES, STATUS_ICONS, getStatusLabel } from '../utils/labels';

interface StatusToggleProps {
  item: TrackedItem;
  onChange: (status: ItemStatus) => void;
}

/** Buton grubu: kart görünümünde durumu hızlıca değiştirmek için. */
export default function StatusToggle({ item, onChange }: StatusToggleProps) {
  return (
    <div className="status-toggle" role="group" aria-label={`"${item.title}" durumunu değiştir`}>
      {ITEM_STATUSES.map((status) => {
        const isActive = status === item.status;
        return (
          <button
            key={status}
            type="button"
            className={`status-toggle-btn${isActive ? ` active status-${status}` : ''}`}
            aria-pressed={isActive}
            onClick={() => {
              if (!isActive) onChange(status);
            }}
          >
            <i className={`bi ${STATUS_ICONS[status]}`} aria-hidden="true" />
            <span>{getStatusLabel(status)}</span>
          </button>
        );
      })}
    </div>
  );
}
