import "../css/main.css";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { addToCart } from "./cart";

async function renderProduct() {
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    app.innerHTML = `<div class="container"><p>Produit introuvable. <a href="/shop.html">Retour à la boutique</a></p></div>`;
    return;
  }

  app.innerHTML = `<div class="container"><p>Chargement du produit...</p></div>`;

  try {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) {
      app.innerHTML = `<div class="container"><p>Produit introuvable. <a href="/shop.html">Retour à la boutique</a></p></div>`;
      return;
    }

    const p = { id: snap.id, ...snap.data() };
    app.innerHTML = `
      <div class="container" style="max-width:800px">
        <a href="/shop.html" style="color:#2c7a4b">← Retour à la boutique</a>
        <div style="display:flex;gap:32px;margin-top:24px;flex-wrap:wrap">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:320px;height:320px;object-fit:cover;border-radius:8px" />` : ""}
          <div style="flex:1">
            <h1>${p.name}</h1>
            <p style="margin:16px 0">${p.description || ""}</p>
            <div class="price" style="font-size:1.5rem;margin-bottom:24px">${parseFloat(p.price || 0).toFixed(2)} €</div>
            <button id="add-to-cart" class="btn">Ajouter au panier</button>
            <div id="cart-msg" style="margin-top:12px"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("add-to-cart").addEventListener("click", () => {
      addToCart({ id: p.id, name: p.name, price: p.price, image: p.image || "" });
      document.getElementById("cart-msg").innerHTML = `<div class="alert alert-success">Produit ajouté au panier ! <a href="/cart.html">Voir le panier</a></div>`;
    });
  } catch (err) {
    app.innerHTML = `<div class="container"><p>Erreur : ${err.message}</p></div>`;
  }
}

renderProduct();
