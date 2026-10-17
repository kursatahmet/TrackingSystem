import type { SortOption } from '../interfaces/filters';
import type { ItemStatus, ItemType } from '../interfaces/item';

export const ITEM_TYPES: readonly ItemType[] = ['movie', 'series', 'book'];
export const ITEM_STATUSES: readonly ItemStatus[] = ['planned', 'in_progress', 'completed'];

export const TYPE_LABELS: Record<ItemType, string> = {
  movie: 'Film',
  series: 'Dizi',
  book: 'Kitap',
};

export const TYPE_PLURAL_LABELS: Record<ItemType, string> = {
  movie: 'Filmler',
  series: 'Diziler',
  book: 'Kitaplar',
};

export const TYPE_ICONS: Record<ItemType, string> = {
  movie: 'bi-film',
  series: 'bi-tv',
  book: 'bi-book',
};

export const STATUS_ICONS: Record<ItemStatus, string> = {
  planned: 'bi-bookmark',
  in_progress: 'bi-hourglass-split',
  completed: 'bi-check2-circle',
};

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'En yeni',
  oldest: 'En eski',
  title: 'Başlık (A-Z)',
  rating: 'Puan (yüksek)',
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  planned: 'Planlanan',
  in_progress: 'Devam Edilen',
  completed: 'Bitirilen',
};

/** Durum etiketlerinin tek kaynağı: Planlanan / Devam Edilen / Bitirilen (tüm türler için ortak). */
export function getStatusLabel(status: ItemStatus): string {
  return STATUS_LABELS[status];
}

/** "creator" alanının türe göre etiketi. */
export function getCreatorLabel(type?: ItemType): string {
  switch (type) {
    case 'movie':
      return 'Yönetmen';
    case 'series':
      return 'Yaratıcı / Yönetmen';
    case 'book':
      return 'Yazar';
    default:
      return 'Yönetmen / Yazar';
  }
}
