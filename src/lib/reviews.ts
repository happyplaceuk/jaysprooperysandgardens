import { put, head } from '@vercel/blob';

const BLOB_PATH = 'reviews.json';

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export async function readReviews(): Promise<Review[]> {
  try {
    const blob = await head(BLOB_PATH, { token: import.meta.env.BLOB_READ_WRITE_TOKEN });
    const res = await fetch(blob.url, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as Review[];
  } catch {
    // No reviews saved yet.
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(reviews), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });
}
