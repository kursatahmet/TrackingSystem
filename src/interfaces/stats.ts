import type { ItemStatus, ItemType } from './item';

export type StatusCounts = Record<ItemStatus, number>;

export type TypeStats = StatusCounts & { total: number };

export interface CollectionStats {
  total: number;
  byStatus: StatusCounts;
  byType: Record<ItemType, TypeStats>;
}
