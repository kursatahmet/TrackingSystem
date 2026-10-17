import type { ItemType } from '../interfaces/item';
import { TYPE_ICONS, TYPE_LABELS } from '../utils/labels';

interface TypeBadgeProps {
  type: ItemType;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={`badge-type type-${type}`}>
      <i className={`bi ${TYPE_ICONS[type]}`} aria-hidden="true" />
      {TYPE_LABELS[type]}
    </span>
  );
}
