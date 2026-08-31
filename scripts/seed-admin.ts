import { Timestamp } from 'firebase-admin/firestore';
import { getDatabase } from '../server/lib/firebase.ts';
import { hashPassword } from '../server/lib/password.ts';
import { createDefaultContent } from '../shared/site-content.ts';

const username = process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin01';
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
if (!/^[a-z0-9_-]{3,40}$/.test(username) || !password || password.length < 8 || password.length > 128) {
  throw new Error('Set ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD (8–128 characters).');
}
const database = getDatabase();
const account = database.collection('adminAccounts').doc(username);
const home = database.collection('siteContent').doc('home');
const passwordHash = await hashPassword(password);
const created = await database.runTransaction(async transaction => {
  const [accountSnapshot, homeSnapshot] = await transaction.getAll(account, home);
  if (!homeSnapshot.exists) transaction.create(home, createDefaultContent());
  if (accountSnapshot.exists) return false;
  transaction.create(account, {
    username, passwordHash, role: 'master', active: true,
    sessionVersion: 1, createdAt: Timestamp.now(), lastLoginAt: null,
  });
  return true;
});
console.log(created ? 'Master account created: ' + username : 'Account already exists; no password was changed.');
await database.terminate();
