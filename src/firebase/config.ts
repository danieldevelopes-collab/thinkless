import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

// A Firebase web config is public by design — it identifies the project and is
// safe to ship in client code (security is enforced by Auth + Firestore rules).
const firebaseConfig = {
  apiKey: "AIzaSyBadwf4yvPZ-MeEzn1JjCmtAcb8KM7-6FM",
  authDomain: "danieldevelopes-portfolio.firebaseapp.com",
  projectId: "danieldevelopes-portfolio",
  storageBucket: "danieldevelopes-portfolio.firebasestorage.app",
  messagingSenderId: "870896768719",
  appId: "1:870896768719:web:c48bac28b43753cd34c9ba",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Offline-first: cache documents in IndexedDB so reads come from cache (Spark-safe)
// and the app keeps working without a connection.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
