import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK using Environment Variables
if (!getApps().length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      initializeApp({
        projectId: projectId || "sunrise-app-demo",
      });
    }
  } catch (error) {
    console.error("Firebase Admin SDK Initialization Error:", error);
  }
}

/**
 * Verifies a real Firebase ID token cryptographically using the official Firebase Admin SDK.
 * @param idToken Cryptographically signed JWT string from client Firebase Auth SDK
 */
export async function verifyFirebaseIdToken(idToken: string) {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Missing or invalid token string");
  }

  // Official Firebase Admin SDK Token Verification
  // Returns DecodedIdToken containing verified email, uid, auth_time, and exp
  const auth = getAuth();
  const decodedToken = await auth.verifyIdToken(idToken, true);
  return decodedToken;
}
