import type { ItemStatus } from '../interfaces/item';
import { getStatusLabel } from '../utils/labels';

interface StatusBadgeProps {
  status: ItemStatus;
}

/** Durum rozeti: planned = gri, in_progress = sarı, completed = yeşil. */
export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge-status status-${status}`}>{getStatusLabel(status)}</span>;
}
