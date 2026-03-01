import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as Sentry from "@sentry/browser";

Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });

function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
  };
}

async function writeError(payload) {
  await addDoc(collection(db, "errors"), {
    ...payload,
    createdAt: serverTimestamp()
  });
}

export async function logError(error, context = {}) {
  const user = auth.currentUser;
  const payload = {
    message: error?.message || "unknown",
    stack: error?.stack || "",
    route: location.pathname,
    userId: user?.uid || null,
    device: getDeviceInfo(),
    context,
    severity: context.severity || "error"
  };

  await writeError(payload);

  if (context.severity === "critical") {
    Sentry.captureException(error);
  }
}

window.addEventListener("error", (e) => {
  logError(e.error || new Error(e.message), { severity: "critical", type: "window.error" });
});

window.addEventListener("unhandledrejection", (e) => {
  logError(e.reason || new Error("Unhandled promise"), { severity: "critical", type: "unhandledrejection" });
});
