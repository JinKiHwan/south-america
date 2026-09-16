import { contactTypeSnapshot } from '../lib/contact-types';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return (await contactTypeSnapshot()).types;
});
