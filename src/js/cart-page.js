import "../css/main.css";
import { getCart, saveCart, cartTotal } from "./cart";

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function emptyCart() {
  saveCart([]);
  renderCart();
}

function renderCart() {
  const app = document.getElementById("app");
  const cart = getCart();

  if (cart.length === 0) {
    app.innerHTML = `
      <div class="container">
        <h1>Panier</h1>
        <p>Votre panier est vide. <a href="/shop.html">Continuer les achats</a></p>
      </div>
    `;
    return;
  }

  const total = cartTotal();
  app.innerHTML = `
    <div class="container">
      <h1>Panier</h1>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr>
              <td>${item.image ? `<img src="${item.image}" alt="${item.name}" style="height:50px;object-fit:cover;border-radius:4px">` : ""}</td>
              <td>${item.name}</td>
              <td>${parseFloat(item.price).toFixed(2)} €</td>
              <td>${item.qty}</td>
              <td>${(item.price * item.qty).toFixed(2)} €</td>
              <td><button class="btn btn-danger remove-item" data-id="${item.id}">Supprimer</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="cart-total">Total : ${total.toFixed(2)} €</div>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button id="empty-cart" class="btn btn-secondary">Vider le panier</button>
        <a href="/checkout.html" class="btn">Passer la commande</a>
      </div>
    </div>
  `;

  app.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
  document.getElementById("empty-cart").addEventListener("click", emptyCart);
}

renderCart();
