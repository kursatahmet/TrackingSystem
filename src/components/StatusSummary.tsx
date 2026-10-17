import type { CollectionStats } from '../interfaces/stats';
import { ITEM_STATUSES, ITEM_TYPES, TYPE_ICONS, TYPE_PLURAL_LABELS, getStatusLabel } from '../utils/labels';
import { toPercent } from '../utils/stats';

interface StatusSummaryProps {
  stats: CollectionStats;
}

/** Her tür için durum dağılımı: "Bitirilen: 5", "Devam Edilen: 1", "Planlanan: 2" gibi. */
export default function StatusSummary({ stats }: StatusSummaryProps) {
  return (
    <div className="card h-100 mb-0">
      <div className="card-header">
        <h2 className="card-title">Durum Özeti</h2>
      </div>

      <div className="summary-list">
        {ITEM_TYPES.map((type) => {
          const typeStats = stats.byType[type];
          const completedPercent = toPercent(typeStats.completed, typeStats.total);
          return (
            <div className="summary-row" key={type}>
              <div className="progress-label-row">
                <span className="progress-label">
                  <i className={`bi ${TYPE_ICONS[type]} me-2`} aria-hidden="true" />
                  {TYPE_PLURAL_LABELS[type]}
                </span>
                <span className="progress-value">
                  {typeStats.total === 0 ? 'Henüz kayıt yok' : `%${completedPercent} tamamlandı`}
                </span>
              </div>

              <div
                className="summary-bar"
                role="img"
                aria-label={ITEM_STATUSES.map(
                  (status) => `${getStatusLabel(status)}: ${typeStats[status]}`,
                ).join(', ')}
              >
                {ITEM_STATUSES.map((status) =>
                  typeStats[status] > 0 ? (
                    <span
                      key={status}
                      className={`summary-bar-segment status-${status}`}
                      style={{ width: `${toPercent(typeStats[status], typeStats.total)}%` }}
                    />
                  ) : null,
                )}
              </div>

              <ul className="summary-legend">
                {[...ITEM_STATUSES].reverse().map((status) => (
                  <li key={status}>
                    <span className={`legend-dot status-${status}`} aria-hidden="true" />
                    {getStatusLabel(status)}: <strong>{typeStats[status]}</strong>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
