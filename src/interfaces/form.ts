import type { ItemStatus, ItemType } from './item';

/** Form alanlarının ham değerleri. Metin kutuları her zaman string tutar. */
export interface ItemFormValues {
  title: string;
  /** Boş string: henüz tür seçilmedi. */
  type: ItemType | '';
  status: ItemStatus;
  creator: string;
  year: string;
  rating: number | null;
  note: string;
}

export type ItemFormField = keyof ItemFormValues;

/** Alan adına göre hata mesajları. Hatası olmayan alan bulunmaz. */
export type ItemFormErrors = Partial<Record<ItemFormField, string>>;
