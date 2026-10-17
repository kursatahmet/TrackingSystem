import { routeToPath } from '../utils/navigation';

export default function NotFound() {
  return (
    <div className="error-card-custom">
      <div className="error-title-huge" aria-hidden="true">
        4<i className="bi bi-bookmark-x" />4
      </div>
      <h1 className="error-subtitle">Sayfa bulunamadı</h1>
      <p className="error-desc">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Listene dönerek devam edebilirsin.</p>
      <div className="error-actions-group">
        <a href={routeToPath({ page: 'dashboard' })} className="btn-custom btn-custom-primary">
          <i className="bi bi-grid-fill" aria-hidden="true" /> Dashboard'a dön
        </a>
        <a href={routeToPath({ page: 'list', type: 'all' })} className="btn-custom btn-custom-light">
          Tüm Liste
        </a>
      </div>
    </div>
  );
}
