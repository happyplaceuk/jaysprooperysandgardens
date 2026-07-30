import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { readUploadedGalleryItems, writeUploadedGalleryItems } from '../../lib/gallery';

export const prerender = false;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_ALT_LENGTH = 150;
const MAX_CAPTION_LENGTH = 60;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const file = form.get('photo');
  if (!(file instanceof File) || file.size === 0) {
    return redirect('/upload?error=file', 303);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return redirect('/upload?error=type', 303);
  }
  if (file.size > MAX_SIZE_BYTES) {
    return redirect('/upload?error=size', 303);
  }

  const alt = String(form.get('alt') ?? '').trim().slice(0, MAX_ALT_LENGTH);
  const caption = String(form.get('caption') ?? '').trim().slice(0, MAX_CAPTION_LENGTH);

  if (!alt) {
    return redirect('/upload?error=file', 303);
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `gallery-uploads/${Date.now()}.${extension}`;

  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
    contentType: file.type,
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,
  });

  const items = await readUploadedGalleryItems();
  items.unshift({ image: blob.url, alt, caption });
  await writeUploadedGalleryItems(items);

  return redirect('/upload?submitted=1', 303);
};
