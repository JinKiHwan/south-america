import { contactTypeSnapshot } from '../../lib/contact-types';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  return contactTypeSnapshot();
});
