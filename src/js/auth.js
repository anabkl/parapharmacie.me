import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

export async function isAdmin(uid) {
  const snap = await getDoc(doc(db, "roles", uid));
  return snap.exists() && snap.data().role === "admin";
}

export function authWatcher(callback) {
  return onAuthStateChanged(auth, callback);
}
