import type { ItemStatus } from './item';
import type { TypeFilter } from './navigation';

export type StatusFilter = ItemStatus | 'all';

export type SortOption = 'newest' | 'oldest' | 'title' | 'rating';

export type ViewMode = 'table' | 'cards';

export interface ItemFilterOptions {
  type: TypeFilter;
  status: StatusFilter;
  search: string;
}
