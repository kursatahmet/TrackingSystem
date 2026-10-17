/** Kaydın türü: film, dizi veya kitap. */
export type ItemType = 'movie' | 'series' | 'book';

/** Kaydın durumu. Arayüzdeki etiketi türe göre değişir (bkz. utils/labels.ts). */
export type ItemStatus = 'planned' | 'in_progress' | 'completed';

/** Takip edilen tek bir film, dizi veya kitap kaydı. */
export interface TrackedItem {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  /** Yönetmen (film/dizi) veya yazar (kitap). */
  creator?: string;
  year?: number;
  /** 1 ile 5 arasında puan. */
  rating?: number;
  note?: string;
  /** ISO 8601 biçiminde oluşturulma zamanı. */
  createdAt: string;
  /** ISO 8601 biçiminde son güncellenme zamanı. */
  updatedAt: string;
}

/** Kayıt eklerken veya güncellerken kullanıcıdan gelen alanlar. */
export type ItemInput = Omit<TrackedItem, 'id' | 'createdAt' | 'updatedAt'>;
