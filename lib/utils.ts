import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TR_CHAR_MAP: Record<string, string> = {
  ş: "s", Ş: "S", ğ: "g", Ğ: "G",
  ı: "i", İ: "I", ö: "o", Ö: "O",
  ü: "u", Ü: "U", ç: "c", Ç: "C",
};

export function slugify(text: string): string {
  return text
    .replace(/[şŞğĞıİöÖüÜçÇ]/g, (char) => TR_CHAR_MAP[char] || char)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export function getProgressPercentage(collected: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((collected / target) * 100));
}

export function sanitizeMapEmbed(html: string): string {
  const match = html.match(/<iframe[^>]*src="(https:\/\/www\.google\.com\/maps\/embed[^"]*)"[^>]*><\/iframe>/i);
  if (!match) return "";
  const src = match[1];
  return `<iframe src="${src}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}
