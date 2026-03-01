import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const login=(email,password)=>signInWithEmailAndPassword(auth,email,password);
export const authWatcher=(cb)=>onAuthStateChanged(auth,cb);
export const isAdmin=async(uid)=>{const s=await getDoc(doc(db,"roles",uid));return s.exists()&&s.data().role==="admin"};
