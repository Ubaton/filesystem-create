import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API,
  authDomain: process.env.NEXT_PUBLIC_DOMAIN_URI,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase once (hot reload safe)
const app = getApps()[0] ?? initializeApp(firebaseConfig);

// Initialize Analytics only on the client, and never let a missing/partial
// Firebase config (e.g. local dev without .env) crash the page
let analytics = null;
if (typeof window !== "undefined" && firebaseConfig.projectId) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

const db = getFirestore(app);

export { db, analytics };
