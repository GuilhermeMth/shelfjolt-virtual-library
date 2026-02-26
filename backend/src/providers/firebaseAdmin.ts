import admin from "firebase-admin";

export function initializeFirebaseAdmin(serviceAccount: object) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export { admin };
