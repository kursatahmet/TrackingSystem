import type { ItemType } from './item';

/** Liste sayfasındaki tür filtresi: tek bir tür veya hepsi. */
export type TypeFilter = ItemType | 'all';

/** Uygulamadaki sayfalar. Sayfa geçişi bu değeri tutan bir state ile yapılır. */
export type Route =
  | { page: 'dashboard' }
  | { page: 'list'; type: TypeFilter }
  | { page: 'not-found' };
