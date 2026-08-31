import { newsletterCountries } from '../lib/newsletter';
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');
  return newsletterCountries();
});
