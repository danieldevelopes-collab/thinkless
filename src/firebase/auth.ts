import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./config";

const google = new GoogleAuthProvider();

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
export function signInWithGoogle() {
  return signInWithPopup(auth, google);
}
export function signInEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function registerEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}
export function logout() {
  return signOut(auth);
}

export type { User };
