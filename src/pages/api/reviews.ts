import type { APIRoute } from 'astro';
import { readReviews, writeReviews } from '../../lib/reviews';

export const prerender = false;

const MAX_NAME_LENGTH = 80;
const MAX_TEXT_LENGTH = 1000;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot: a field real visitors never see or fill in. Bots that fill every
  // field on the form trip this, and we silently drop the submission.
  if (String(form.get('company') ?? '').trim() !== '') {
    return redirect('/#reviews?submitted=1', 303);
  }

  const name = String(form.get('name') ?? '').trim().slice(0, MAX_NAME_LENGTH);
  const text = String(form.get('text') ?? '').trim().slice(0, MAX_TEXT_LENGTH);
  const rating = Math.min(5, Math.max(1, parseInt(String(form.get('rating') ?? '5'), 10) || 5));

  if (!name || !text) {
    return redirect('/#reviews?error=1', 303);
  }

  const reviews = await readReviews();
  reviews.unshift({ name, rating, text, date: new Date().toISOString() });
  await writeReviews(reviews);

  return redirect('/#reviews?submitted=1', 303);
};
