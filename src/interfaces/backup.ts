import type { TrackedItem } from './item';

/** Dışa aktarılan JSON yedek dosyasının yapısı. */
export interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  items: TrackedItem[];
}

/** Bir yedek dosyası okunduktan sonra elde edilen sonuç. */
export interface ImportResult {
  items: TrackedItem[];
  /** Geçersiz veya tekrarlanan olduğu için atlanan kayıt sayısı. */
  skipped: number;
}
