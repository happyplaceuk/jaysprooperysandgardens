import { put, head } from '@vercel/blob';

const BLOB_PATH = 'uploaded-gallery.json';

export interface UploadedGalleryItem {
  image: string;
  alt: string;
  caption: string;
}

export async function readUploadedGalleryItems(): Promise<UploadedGalleryItem[]> {
  try {
    const blob = await head(BLOB_PATH, { token: import.meta.env.BLOB_READ_WRITE_TOKEN });
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as UploadedGalleryItem[];
  } catch {
    // No uploads yet.
    return [];
  }
}

export async function writeUploadedGalleryItems(items: UploadedGalleryItem[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(items), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });
}
