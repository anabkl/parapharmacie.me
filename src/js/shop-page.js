import "../css/main.css";
import { getProducts } from "./products";
import { addToCart } from "./cart";

async function renderShop() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container">
      <h1>Boutique</h1>
      <div id="product-grid" class="product-grid">Chargement des produits...</div>
    </div>
  `;

  try {
    const products = await getProducts();
    const grid = document.getElementById("product-grid");
    if (products.length === 0) {
      grid.innerHTML = "<p>Aucun produit disponible pour le moment.</p>";
      return;
    }
    grid.innerHTML = products.map(p => `
      <div class="product-card">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : ""}
        <h3><a href="/product.html?id=${p.id}" style="color:inherit;text-decoration:none">${p.name}</a></h3>
        <p>${p.description || ""}</p>
        <span class="price">${parseFloat(p.price || 0).toFixed(2)} €</span>
        <button class="btn add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image || ""}">
          Ajouter au panier
        </button>
      </div>
    `).join("");

    grid.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart({
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price),
          image: btn.dataset.image,
        });
        btn.textContent = "Ajouté ✓";
        setTimeout(() => { btn.textContent = "Ajouter au panier"; }, 2000);
      });
    });
  } catch (e) {
    document.getElementById("product-grid").innerHTML = `<p>Erreur lors du chargement : ${e.message}</p>`;
  }
}

renderShop();
