import { useMemo } from 'react';
import type { TrackedItem } from '../interfaces/item';
import PageHeader from '../components/PageHeader';
import RecentItems from '../components/RecentItems';
import StatsCards from '../components/StatsCards';
import StatusSummary from '../components/StatusSummary';
import { sortItems } from '../utils/itemFilters';
import { getCollectionStats } from '../utils/stats';

const RECENT_ITEM_COUNT = 5;

interface DashboardProps {
  items: TrackedItem[];
  onAdd: () => void;
}

export default function Dashboard({ items, onAdd }: DashboardProps) {
  const stats = useMemo(() => getCollectionStats(items), [items]);
  const recentItems = useMemo(() => sortItems(items, 'newest').slice(0, RECENT_ITEM_COUNT), [items]);

  return (
    <>
      <PageHeader title="Gösterge Paneli" subtitle="Film, dizi ve kitap koleksiyonunun genel görünümü." />
      <StatsCards stats={stats} />
      <div className="row g-3 g-xl-4">
        <div className="col-lg-7">
          <StatusSummary stats={stats} />
        </div>
        <div className="col-lg-5">
          <RecentItems items={recentItems} onAdd={onAdd} />
        </div>
      </div>
    </>
  );
}
