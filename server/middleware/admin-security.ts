export default defineEventHandler(event => {
  if (event.path.startsWith('/admin') || event.path.startsWith('/api/admin')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
    setHeader(event, 'X-Frame-Options', 'DENY');
    setHeader(event, 'X-Content-Type-Options', 'nosniff');
    setHeader(event, 'Referrer-Policy', 'same-origin');
    setHeader(event, 'Cache-Control', 'no-store, private');
  }
});
