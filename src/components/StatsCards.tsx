import type { CollectionStats } from '../interfaces/stats';
import { ITEM_TYPES, TYPE_ICONS, TYPE_PLURAL_LABELS, getStatusLabel } from '../utils/labels';
import { routeToHash } from '../utils/navigation';

interface StatsCardsProps {
  stats: CollectionStats;
}

/** Dashboard'un üst satırı: toplam kayıt ve tür bazlı sayılar. */
export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="row g-3 g-xl-4 mb-4">
      <div className="col-sm-6 col-xl-3">
        <div className="card card-stat stat-card-total">
          <div className="stat-label">Toplam Kayıt</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-total-meta">
            <span>
              <strong>{stats.byStatus.completed}</strong> tamamlandı
            </span>
            <span>
              <strong>{stats.byStatus.in_progress}</strong> devam ediyor
            </span>
          </div>
          <i className="bi bi-collection-play stat-total-icon" aria-hidden="true" />
        </div>
      </div>

      {ITEM_TYPES.map((type) => {
        const typeStats = stats.byType[type];
        return (
          <div className="col-sm-6 col-xl-3" key={type}>
            <div className="card card-stat stat-card-type">
              <div className="d-flex justify-content-between align-items-start">
                <div className="stat-label">{TYPE_PLURAL_LABELS[type]}</div>
                <span className="stat-icon" aria-hidden="true">
                  <i className={`bi ${TYPE_ICONS[type]}`} />
                </span>
              </div>
              <div className="stat-value">{typeStats.total}</div>
              <div className="stat-chips">
                <span className="stat-chip status-completed">
                  {getStatusLabel('completed')}: {typeStats.completed}
                </span>
                <span className="stat-chip status-in_progress">
                  {getStatusLabel('in_progress')}: {typeStats.in_progress}
                </span>
              </div>
              <a href={routeToHash({ page: 'list', type })} className="stat-link stretched-link">
                {TYPE_PLURAL_LABELS[type]} listesine git <i className="bi bi-arrow-right" aria-hidden="true" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
