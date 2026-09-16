import { getDatabase, isFirebaseConfigured } from './firebase';
import { defaultContactTypes, type ContactType } from '../../shared/contact-types';

export async function contactTypeSnapshot(): Promise<{ version: number; types: ContactType[] }> {
  if (!isFirebaseConfigured()) return { version: 0, types: structuredClone(defaultContactTypes) };
  const doc = await getDatabase().collection('siteSettings').doc('contactTypes').get();
  if (!doc.exists) return { version: 0, types: structuredClone(defaultContactTypes) };
  return {
    version: doc.data()?.version ?? 0,
    types: doc.data()?.types ?? structuredClone(defaultContactTypes),
  };
}
