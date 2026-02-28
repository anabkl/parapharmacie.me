import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as Sentry from "@sentry/browser";

Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });

export async function logError(error, context = {}) {
  await addDoc(collection(db, "errors"), {
    message: error.message,
    stack: error.stack,
    context,
    createdAt: serverTimestamp()
  });
  Sentry.captureException(error);
}
