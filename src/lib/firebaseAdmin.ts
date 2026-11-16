import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

export const isAdminConfigured = Boolean(
  process.env.FIREBASE_ADMIN_PRIVATE_KEY && 
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL
);

try {
  if (!admin.apps.length) {
    if (isAdminConfigured) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
      });
      adminDb = admin.firestore();
      adminAuth = admin.auth();
    }
  } else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
} catch (error) {
  console.warn("Firebase Admin initialization skipped or running with mock:", error);
}

export { adminDb, adminAuth };
