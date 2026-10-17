import type { TrackedItem } from '../interfaces/item';
import type { CollectionStats, StatusCounts, TypeStats } from '../interfaces/stats';

function emptyStatusCounts(): StatusCounts {
  return { planned: 0, in_progress: 0, completed: 0 };
}

function emptyTypeStats(): TypeStats {
  return { ...emptyStatusCounts(), total: 0 };
}

/** Toplam, durum bazlı ve tür bazlı sayıları tek geçişte hesaplar. */
export function getCollectionStats(items: TrackedItem[]): CollectionStats {
  const stats: CollectionStats = {
    total: items.length,
    byStatus: emptyStatusCounts(),
    byType: { movie: emptyTypeStats(), series: emptyTypeStats(), book: emptyTypeStats() },
  };

  for (const item of items) {
    stats.byStatus[item.status] += 1;
    stats.byType[item.type][item.status] += 1;
    stats.byType[item.type].total += 1;
  }

  return stats;
}

export function toPercent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}
