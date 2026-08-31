import { isFirebaseConfigured } from '../../lib/firebase';

export default defineEventHandler(event => {
  privateResponse(event);
  return {
    configured: isFirebaseConfigured(),
    emulator: Boolean(process.env.FIRESTORE_EMULATOR_HOST),
  };
});
