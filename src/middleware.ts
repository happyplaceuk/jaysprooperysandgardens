import { defineMiddleware } from 'astro:middleware';
import { computeSessionToken } from './pages/api/login';

// Gates /upload and /api/upload behind a simple cookie-based login so only Jay
// (with the shared password) can add gallery photos. Everything else on the
// site is public and untouched.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith('/upload') && !pathname.startsWith('/api/upload')) {
    return next();
  }

  const expected = import.meta.env.UPLOAD_PASSWORD;
  const sessionCookie = context.cookies.get('upload_auth')?.value;

  if (expected && sessionCookie === computeSessionToken(expected)) {
    return next();
  }

  return context.redirect('/login', 303);
});
