import type { Route, TypeFilter } from '../interfaces/navigation';
import { TYPE_ICONS } from '../utils/labels';
import { routeToHash } from '../utils/navigation';
import Logo from './Logo';

interface SidebarProps {
  route: Route;
  counts: Record<TypeFilter, number>;
  /** Küçük ekranlarda menünün açık olup olmadığı. */
  isOpen: boolean;
  onClose: () => void;
}

interface MenuEntry {
  label: string;
  icon: string;
  route: Route;
  countKey?: TypeFilter;
}

const MENU_SECTIONS: { title: string; entries: MenuEntry[] }[] = [
  {
    title: 'Menü',
    entries: [{ label: 'Gösterge Paneli', icon: 'bi-grid-fill', route: { page: 'dashboard' } }],
  },
  {
    title: 'Koleksiyon',
    entries: [
      { label: 'Tüm Liste', icon: 'bi-collection', route: { page: 'list', type: 'all' }, countKey: 'all' },
      { label: 'Filmler', icon: TYPE_ICONS.movie, route: { page: 'list', type: 'movie' }, countKey: 'movie' },
      { label: 'Diziler', icon: TYPE_ICONS.series, route: { page: 'list', type: 'series' }, countKey: 'series' },
      { label: 'Kitaplar', icon: TYPE_ICONS.book, route: { page: 'list', type: 'book' }, countKey: 'book' },
    ],
  },
];

export default function Sidebar({ route, counts, isOpen, onClose }: SidebarProps) {
  const activeHash = routeToHash(route);

  return (
    <aside id="app-sidebar" className={`sidebar-wrapper${isOpen ? ' show' : ''}`} aria-label="Yan menü">
      <div className="sidebar-top">
        <a href={routeToHash({ page: 'dashboard' })} className="sidebar-brand" onClick={onClose}>
          <Logo />
        </a>
        <button type="button" className="sidebar-close-btn d-xl-none" aria-label="Menüyü kapat" onClick={onClose}>
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Ana menü">
        {MENU_SECTIONS.map((section) => (
          <div className="sidebar-menu-section" key={section.title}>
            <div className="sidebar-menu-title">{section.title}</div>
            <ul className="sidebar-menu-list">
              {section.entries.map((entry) => {
                const hash = routeToHash(entry.route);
                const isActive = hash === activeHash;
                return (
                  <li className="sidebar-menu-item" key={entry.label}>
                    <a
                      href={hash}
                      className={`sidebar-menu-link${isActive ? ' active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      title={entry.label}
                      onClick={onClose}
                    >
                      <i className={`bi ${entry.icon}`} aria-hidden="true" />
                      <span>{entry.label}</span>
                      {entry.countKey && <span className="sidebar-menu-badge">{counts[entry.countKey]}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-info">
        <span className="sidebar-info-icon" aria-hidden="true">
          <i className="bi bi-shield-lock" />
        </span>
        <div className="sidebar-info-body">
          <div className="sidebar-info-title">Yerel depolama</div>
          <div className="sidebar-info-text">Verilerin yalnızca bu tarayıcıda saklanır.</div>
        </div>
      </div>
    </aside>
  );
}
