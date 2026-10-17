import type { ItemFilterOptions, SortOption } from '../interfaces/filters';
import type { TrackedItem } from '../interfaces/item';

const LOCALE = 'tr-TR';

/**
 * Arama için metni normalleştirir: Türkçe kurallarıyla küçük harfe çevirir ve
 * "ı" ile "i"yi eşit sayar. Böylece "KITAP", "KİTAP" ve "kitap" aynı sonucu verir;
 * İngilizce başlıklarda "I" ile yapılan aramalar da çalışır.
 */
function normalizeForSearch(text: string): string {
  return text.toLocaleLowerCase(LOCALE).replace(/ı/g, 'i');
}

/** Tür, durum ve başlık aramasına göre kayıtları süzer. Arama büyük/küçük harf duyarsızdır. */
export function filterItems(items: TrackedItem[], { type, status, search }: ItemFilterOptions): TrackedItem[] {
  const query = normalizeForSearch(search.trim());
  return items.filter(
    (item) =>
      (type === 'all' || item.type === type) &&
      (status === 'all' || item.status === status) &&
      (query === '' || normalizeForSearch(item.title).includes(query)),
  );
}

export function sortItems(items: TrackedItem[], sort: SortOption): TrackedItem[] {
  const sorted = [...items];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, LOCALE));
    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
}
