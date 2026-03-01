import "./css/main.css";
import { getProducts } from "./js/products";

async function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="hero">
      <h1>Bienvenue chez Parapharmacie.me</h1>
      <p>Votre pharmacie en ligne de confiance</p>
      <a href="/shop.html" class="btn">Voir la boutique</a>
    </div>
    <div class="container">
      <h2>Produits vedettes</h2>
      <div id="featured-products" class="product-grid">Chargement...</div>
    </div>
  `;

  try {
    const products = await getProducts();
    const grid = document.getElementById("featured-products");
    if (products.length === 0) {
      grid.innerHTML = "<p>Aucun produit disponible.</p>";
      return;
    }
    grid.innerHTML = products.slice(0, 4).map(p => `
      <div class="product-card">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : ""}
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
        <span class="price">${parseFloat(p.price).toFixed(2)} €</span>
        <a href="/product.html?id=${p.id}" class="btn">Voir le produit</a>
      </div>
    `).join("");
  } catch (e) {
    document.getElementById("featured-products").innerHTML = "<p>Erreur lors du chargement des produits.</p>";
  }
}

renderHome();

