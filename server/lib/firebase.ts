import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    (process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIRESTORE_EMULATOR_HOST),
  );
}

export function getAdminApp() {
  const existing = getApps().find(app => app.name === 'south-america-admin');
  if (existing) return existing;
  if (!isFirebaseConfigured()) throw new Error('Firebase server credentials are not configured.');

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
      ? {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      : undefined;

  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    ...(process.env.FIRESTORE_EMULATOR_HOST
      ? {}
      : { credential: serviceAccount ? cert(serviceAccount) : applicationDefault() }),
  }, 'south-america-admin');
}

export function getDatabase() {
  return getFirestore(getAdminApp());
}

export function getImageBucket() {
  if (!process.env.FIREBASE_STORAGE_BUCKET) throw new Error('Firebase Storage bucket is not configured.');
  return getStorage(getAdminApp()).bucket();
}
