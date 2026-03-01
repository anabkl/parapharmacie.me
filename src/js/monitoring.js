import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logError(error, context = {}) {
  try {
    await addDoc(collection(db, "errors"), {
      message: error.message,
      stack: error.stack,
      context,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Failed to log error:", e);
  }
}
