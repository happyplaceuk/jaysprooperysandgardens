import { defineMiddleware } from 'astro:middleware';

// Gates /upload and /api/upload behind HTTP Basic Auth so only Jay (with the
// shared credentials) can add gallery photos. Everything else on the site is
// public and untouched.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith('/upload') && !pathname.startsWith('/api/upload')) {
    return next();
  }

  const expectedUser = import.meta.env.UPLOAD_USERNAME;
  const expectedPass = import.meta.env.UPLOAD_PASSWORD;

  const authHeader = context.request.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(':');
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && pass === expectedPass) {
      return next();
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Upload photos"' },
  });
});
