import type { ItemType } from '../interfaces/item';
import type { Route } from '../interfaces/navigation';
import { ITEM_TYPES, TYPE_PLURAL_LABELS } from './labels';

/*
 * State tabanlı sayfa geçişi.
 * Aktif sayfa App içinde bir state olarak tutulur; bu state URL hash'i (#/filmler gibi)
 * ile senkronize edilir. Böylece ek paket olmadan sayfa yenileme ve tarayıcının
 * geri/ileri tuşları da çalışır.
 */

const TYPE_SLUGS: Record<ItemType, string> = {
  movie: 'filmler',
  series: 'diziler',
  book: 'kitaplar',
};

export function routeToHash(route: Route): string {
  switch (route.page) {
    case 'dashboard':
      return '#/';
    case 'list':
      return route.type === 'all' ? '#/liste' : `#/${TYPE_SLUGS[route.type]}`;
    case 'not-found':
      return '#/404';
  }
}

export function hashToRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (path === '') return { page: 'dashboard' };
  if (path === 'liste') return { page: 'list', type: 'all' };

  const type = ITEM_TYPES.find((itemType) => TYPE_SLUGS[itemType] === path);
  return type ? { page: 'list', type } : { page: 'not-found' };
}

export function navigate(route: Route): void {
  window.location.hash = routeToHash(route);
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
