import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "parashop-tawfiq-v2.firebaseapp.com",
  projectId: "parashop-tawfiq-v2",
  storageBucket: "parashop-tawfiq-v2.firebasestorage.app",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
