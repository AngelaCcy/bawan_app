import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Product images are either bare filenames under public/img/<brand>/
// (hand-placed) or full URLs (Vercel Blob, from the admin xlsx import).
export function productImageSrc(
  brand: string,
  filename: string | undefined
): string {
  if (!filename) return "/img/placeholder.svg";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `/img/${brand}/${filename}`;
}
