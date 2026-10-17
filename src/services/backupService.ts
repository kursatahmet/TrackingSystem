import type { BackupFile, ImportResult } from '../interfaces/backup';
import type { TrackedItem } from '../interfaces/item';
import { isTrackedItem, pickItemFields } from '../utils/validation';

/*
 * JSON yedekleme: kayıtları dosyaya yazar ve dosyadan okur.
 * Okunan kayıtları depoya yazmak itemService'in işidir.
 */

const BACKUP_APP_ID = 'izleoku';
const BACKUP_VERSION = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Kayıtları tarayıcı üzerinden "izleoku-yedek-YYYY-AA-GG.json" dosyası olarak indirir. */
export function exportToFile(items: TrackedItem[]): void {
  const backup: BackupFile = {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    items,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `izleoku-yedek-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function extractRawItems(parsed: unknown): unknown[] | null {
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === 'object' && parsed !== null) {
    const { items } = parsed as { items?: unknown };
    if (Array.isArray(items)) return items;
  }
  return null;
}

/**
 * Bir yedek dosyasını okur ve doğrular. Hem bu uygulamanın yedek biçimini
 * hem de düz bir kayıt dizisini kabul eder. Geçersiz ve tekrarlanan kayıtlar atlanır.
 */
export async function readBackupFile(file: File): Promise<ImportResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dosya çok büyük. En fazla 5 MB boyutunda bir yedek seç.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error('Dosya okunamadı. Geçerli bir JSON dosyası seç.');
  }

  const rawItems = extractRawItems(parsed);
  if (rawItems === null) {
    throw new Error('Dosya biçimi tanınmadı. İzleOku ile dışa aktarılmış bir yedek seç.');
  }

  const seenIds = new Set<string>();
  const items: TrackedItem[] = [];
  for (const raw of rawItems) {
    if (isTrackedItem(raw) && !seenIds.has(raw.id)) {
      seenIds.add(raw.id);
      items.push(pickItemFields(raw));
    }
  }

  if (items.length === 0) {
    throw new Error('Dosyada içe aktarılabilecek geçerli kayıt bulunamadı.');
  }

  return { items, skipped: rawItems.length - items.length };
}
