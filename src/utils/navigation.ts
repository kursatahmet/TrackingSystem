import type { ItemType } from '../interfaces/item';
import type { Route } from '../interfaces/navigation';
import { ITEM_TYPES, TYPE_PLURAL_LABELS } from './labels';

/*
 * State tabanlı sayfa geçişi.
 * Aktif sayfa App içinde bir state olarak tutulur; bu state tarayıcının History API'si
 * ile URL yoluna (/filmler gibi) senkronize edilir. Böylece ek paket olmadan sayfa
 * yenileme ve tarayıcının geri/ileri tuşları da çalışır.
 * Not: Sunucunun bilinmeyen yolları index.html'e yönlendirmesi gerekir
 * (Vite geliştirme sunucusu bunu kendisi yapar, Netlify için netlify.toml'da kural var).
 */

/** Sayfa değiştiğinde App'e haber vermek için kullanılan olay adı. */
export const NAVIGATE_EVENT = 'izleoku:navigate';

const TYPE_SLUGS: Record<ItemType, string> = {
  movie: 'filmler',
  series: 'diziler',
  book: 'kitaplar',
};

export function routeToPath(route: Route): string {
  switch (route.page) {
    case 'dashboard':
      return '/';
    case 'list':
      return route.type === 'all' ? '/liste' : `/${TYPE_SLUGS[route.type]}`;
    case 'not-found':
      return '/404';
  }
}

export function pathToRoute(pathname: string): Route {
  const path = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (path === '') return { page: 'dashboard' };
  if (path === 'liste') return { page: 'list', type: 'all' };

  const type = ITEM_TYPES.find((itemType) => TYPE_SLUGS[itemType] === path);
  return type ? { page: 'list', type } : { page: 'not-found' };
}

/** Sayfayı yeniden yüklemeden URL'yi değiştirir ve App'e haber verir. */
export function navigateToPath(path: string): void {
  if (path !== window.location.pathname) {
    window.history.pushState(null, '', path);
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function navigate(route: Route): void {
  navigateToPath(routeToPath(route));
}

export function getRouteTitle(route: Route): string {
  switch (route.page) {
    case 'dashboard':
      return 'Dashboard';
    case 'list':
      return route.type === 'all' ? 'Tüm Liste' : TYPE_PLURAL_LABELS[route.type];
    case 'not-found':
      return 'Sayfa Bulunamadı';
  }
}
