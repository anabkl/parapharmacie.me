import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";

export async function createOrder(data) {
  return addDoc(collection(db, "orders"), { ...data, createdAt: serverTimestamp() });
}

export async function stripeCheckout(sessionId) {
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  return stripe.redirectToCheckout({ sessionId });
}
