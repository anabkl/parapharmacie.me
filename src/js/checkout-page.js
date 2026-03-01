import "../css/main.css";
import { getCart, saveCart, cartTotal } from "./cart";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function renderCheckout() {
  const app = document.getElementById("app");
  const cart = getCart();

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="container">
        <h1>Commande</h1>
        <p>Votre panier est vide. <a href="/shop.html">Continuer les achats</a></p>
      </div>
    `;
    return;
  }

  const total = cartTotal();
  app.innerHTML = `
    <div class="container">
      <h1>Finaliser la commande</h1>
      <h2>Résumé de la commande</h2>
      <table class="cart-table" style="margin-bottom:24px">
        <thead><tr><th>Produit</th><th>Qté</th><th>Prix</th></tr></thead>
        <tbody>
          ${cart.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.qty}</td>
              <td>${(item.price * item.qty).toFixed(2)} €</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="cart-total">Total : ${total.toFixed(2)} €</div>

      <h2>Vos informations</h2>
      <form id="checkout-form">
        <div class="form-group">
          <label>Prénom et Nom</label>
          <input type="text" id="name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="email" required />
        </div>
        <div class="form-group">
          <label>Adresse</label>
          <input type="text" id="address" required />
        </div>
        <div class="form-group">
          <label>Ville</label>
          <input type="text" id="city" required />
        </div>
        <div class="form-group">
          <label>Code postal</label>
          <input type="text" id="zip" required />
        </div>
        <div id="checkout-msg"></div>
        <button type="submit" class="btn">Confirmer la commande</button>
      </form>
    </div>
  `;

  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("checkout-msg");
    msgEl.innerHTML = "";

    const orderData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      zip: document.getElementById("zip").value.trim(),
      items: cart,
      total,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      saveCart([]);
      app.innerHTML = `
        <div class="container">
          <div class="alert alert-success" style="margin-top:32px">
            <h2>Commande confirmée !</h2>
            <p>Merci pour votre commande. Vous recevrez une confirmation par email.</p>
            <a href="/" class="btn" style="margin-top:16px">Retour à l'accueil</a>
          </div>
        </div>
      `;
    } catch (err) {
      msgEl.innerHTML = `<div class="alert alert-error">Erreur : ${err.message}</div>`;
    }
  });
}

renderCheckout();
