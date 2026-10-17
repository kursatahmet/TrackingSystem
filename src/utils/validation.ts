import type { ItemFormErrors, ItemFormValues } from '../interfaces/form';
import type { ItemStatus, ItemType, TrackedItem } from '../interfaces/item';
import { ITEM_STATUSES, ITEM_TYPES } from './labels';

export const LIMITS = {
  title: 150,
  creator: 100,
  note: 1000,
  minYear: 1000,
} as const;

export function getMaxYear(): number {
  return new Date().getFullYear() + 5;
}

export function isItemType(value: unknown): value is ItemType {
  return typeof value === 'string' && (ITEM_TYPES as readonly string[]).includes(value);
}

export function isItemStatus(value: unknown): value is ItemStatus {
  return typeof value === 'string' && (ITEM_STATUSES as readonly string[]).includes(value);
}

export function isValidRating(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 5;
}

/** Form değerlerini doğrular; hatası olan her alan için bir mesaj döner. */
export function validateItemForm(values: ItemFormValues): ItemFormErrors {
  const errors: ItemFormErrors = {};

  const title = values.title.trim();
  if (!title) {
    errors.title = 'Başlık zorunludur.';
  } else if (title.length > LIMITS.title) {
    errors.title = `Başlık en fazla ${LIMITS.title} karakter olabilir.`;
  }

  if (!isItemType(values.type)) {
    errors.type = 'Lütfen bir tür seç.';
  }

  if (!isItemStatus(values.status)) {
    errors.status = 'Geçerli bir durum seç.';
  }

  if (values.creator.trim().length > LIMITS.creator) {
    errors.creator = `Bu alan en fazla ${LIMITS.creator} karakter olabilir.`;
  }

  const year = values.year.trim();
  if (year) {
    const maxYear = getMaxYear();
    const yearNumber = Number(year);
    if (!/^\d{4}$/.test(year) || yearNumber < LIMITS.minYear || yearNumber > maxYear) {
      errors.year = `Yıl ${LIMITS.minYear} ile ${maxYear} arasında 4 haneli bir sayı olmalı.`;
    }
  }

  if (values.rating !== null && !isValidRating(values.rating)) {
    errors.rating = 'Puan 1 ile 5 arasında olmalı.';
  }

  if (values.note.trim().length > LIMITS.note) {
    errors.note = `Not en fazla ${LIMITS.note} karakter olabilir.`;
  }

  return errors;
}

function isOptional<T>(value: unknown, check: (v: unknown) => v is T): boolean {
  return value === undefined || check(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isYear(value: unknown): value is number {
  return Number.isInteger(value);
}

/** Depodan veya yedek dosyasından gelen bilinmeyen bir değerin geçerli bir kayıt olup olmadığını kontrol eder. */
export function isTrackedItem(value: unknown): value is TrackedItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    isString(item.id) &&
    item.id.length > 0 &&
    isString(item.title) &&
    item.title.trim().length > 0 &&
    isItemType(item.type) &&
    isItemStatus(item.status) &&
    isOptional(item.creator, isString) &&
    isOptional(item.year, isYear) &&
    isOptional(item.rating, isValidRating) &&
    isOptional(item.note, isString) &&
    isString(item.createdAt) &&
    isString(item.updatedAt)
  );
}

/** Kayıttan yalnızca bilinen alanları alır; dosyadan gelen fazladan alanları temizler. */
export function pickItemFields(item: TrackedItem): TrackedItem {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    status: item.status,
    creator: item.creator,
    year: item.year,
    rating: item.rating,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
