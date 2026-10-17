import type { ItemInput, TrackedItem } from '../interfaces/item';
import { isTrackedItem } from '../utils/validation';

/*
 * Depolama katmanı: uygulamada localStorage'a erişen TEK yer burasıdır.
 * Bileşenler yalnızca bu fonksiyonları çağırır. İleride gerçek bir veritabanına
 * veya API'ye geçildiğinde sadece bu dosyanın içi değiştirilir.
 */

const STORAGE_KEY = 'izleoku:items';

/** Depodaki tüm kayıtları okur. Veri yoksa ya da bozuksa boş liste döner, uygulama çökmez. */
function readItems(): TrackedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTrackedItem) : [];
  } catch {
    return [];
  }
}

function writeItems(items: TrackedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    throw new Error('Veriler kaydedilemedi. Tarayıcı depolama alanı dolu ya da devre dışı olabilir.');
  }
}

function now(): string {
  return new Date().toISOString();
}

export function getAll(): TrackedItem[] {
  return readItems();
}

export function getById(id: string): TrackedItem | undefined {
  return readItems().find((item) => item.id === id);
}

export function add(input: ItemInput): TrackedItem {
  const timestamp = now();
  const item: TrackedItem = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  writeItems([...readItems(), item]);
  return item;
}

export function update(id: string, changes: Partial<ItemInput>): TrackedItem {
  const items = readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Güncellenecek kayıt bulunamadı.');
  }
  const updated: TrackedItem = { ...items[index], ...changes, id, updatedAt: now() };
  items[index] = updated;
  writeItems(items);
  return updated;
}

export function remove(id: string): void {
  writeItems(readItems().filter((item) => item.id !== id));
}

/** Tüm veriyi verilen kayıtlarla değiştirir (yedekten geri yükleme için). */
export function replaceAll(items: TrackedItem[]): void {
  writeItems(items);
}
