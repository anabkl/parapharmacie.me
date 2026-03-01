import { db, storage } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function getProducts() {
  const snap = await getDocs(query(collection(db, "products")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProduct(data, file) {
  const imgRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);
  return addDoc(collection(db, "products"), { ...data, image: url, active: true });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}
