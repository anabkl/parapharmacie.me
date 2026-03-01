import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { getCart } from "./cart";

export function initCheckout() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async e=>{
    e.preventDefault();

    await addDoc(collection(db,"orders"),{
      customer: form[0].value,
      phone: form[1].value,
      address: form[2].value,
      payment: form[3].value,
      items: getCart(),
      total: getCart().reduce((s,i)=>s+i.price*i.qty,0),
      status: "new",
      createdAt: Date.now()
    });

    localStorage.removeItem("parapharmacie_cart");
    alert("Commande envoyée");
    window.location.href="/index.html";
  });
}
