import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

export function computeSessionToken(password: string): string {
  return crypto.createHash('sha256').update(`upload-session:${password}`).digest('hex');
}

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const expected = import.meta.env.UPLOAD_PASSWORD;

  if (!expected || password !== expected) {
    return redirect('/login?error=1', 303);
  }

  cookies.set('upload_auth', computeSessionToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return redirect('/upload', 303);
};
