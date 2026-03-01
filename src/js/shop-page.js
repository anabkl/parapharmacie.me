import '../../src/css/main.css';
import { getProducts } from './products.js';
import { addToCart } from './cart.js';

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function renderCards(products) {
  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML = '<p style="color:var(--gray)">Aucun produit trouvé.</p>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image || 'https://placehold.co/400x300?text=Produit'}" alt="${p.title}" loading="lazy" />
      <div class="product-card-body">
        <span class="badge">${p.category || 'Général'}</span>
        <h3>${p.title}</h3>
        <p class="price">${Number(p.price).toFixed(2)} MAD</p>
        <button class="btn btn-sm add-to-cart-btn" data-id="${p.id}">Ajouter au panier</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  let allProducts = [];

  try {
    allProducts = await getProducts();
  } catch (e) {
    document.getElementById('productsGrid').innerHTML = '<p class="error-msg">Erreur de chargement des produits.</p>';
    return;
  }

  // Populate category filter
  const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  const sel = document.getElementById('categoryFilter');
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });

  function filter() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const cat = sel.value;
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) && (cat === '' || p.category === cat)
    );
    renderCards(filtered);
  }

  renderCards(allProducts);

  document.getElementById('searchInput').addEventListener('input', filter);
  sel.addEventListener('change', filter);

  document.getElementById('productsGrid').addEventListener('click', e => {
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const product = allProducts.find(p => p.id === id);
      if (product) {
        addToCart(product);
        showToast(`"${product.title}" ajouté au panier ✓`);
      }
      return;
    }
    const card = e.target.closest('.product-card');
    if (card) {
      window.location.href = `/product.html?id=${card.dataset.id}`;
    }
  });
});
