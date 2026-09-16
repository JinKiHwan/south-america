import { newsletterCountrySnapshot } from '../../lib/newsletter';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  return newsletterCountrySnapshot();
});
