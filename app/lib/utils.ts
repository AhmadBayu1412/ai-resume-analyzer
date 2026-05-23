import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes conditionally and resolves conflicts.
 * Useful for building dynamic class strings in components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a byte value into a human-readable string format.
 * @param bytes - The size in bytes to be formatted.
 * @returns A formatted string (e.g., "1.5 MB").
 * @example
 * formatSize(1024); // Returns "1 KB"
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  // Determine the appropriate unit index
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // Format with 2 decimal places and remove unnecessary trailing zeros
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates a cryptographically strong RFC 4122 version 4 UUID.
 * @returns A string representing a unique identifier.
 */
export const generateUUID = (): string => crypto.randomUUID();
