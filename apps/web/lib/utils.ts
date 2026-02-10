/**
 * Utility fonksiyonları - Shadcn/UI ve genel yardımcılar.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind sınıflarını birleştiren ve çakışmaları çözen yardımcı fonksiyon */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
