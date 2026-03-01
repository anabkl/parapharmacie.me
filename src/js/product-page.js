import '../../src/css/main.css';
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { addToCart } from './cart.js';

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('productDetail');

  if (!id) {
    container.innerHTML = '<p class="error-msg">Produit introuvable.</p>';
    return;
  }

  try {
    const snap = await getDoc(doc(db, 'products', id));
    if (!snap.exists()) {
      container.innerHTML = '<p class="error-msg">Ce produit n\'existe pas.</p>';
      return;
    }
    const p = { id: snap.id, ...snap.data() };
    const imgSrc = p.image || 'https://placehold.co/600x400?text=Produit';

    document.title = `${p.title} – Parapharmacie.me`;

    // SEO meta tags
    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement('meta'); prop ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', p.description || p.title);
    setMeta('og:title', p.title, true);
    setMeta('og:image', imgSrc, true);
    setMeta('og:description', p.description || p.title, true);

    // JSON-LD
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.title,
      image: imgSrc,
      description: p.description || '',
      offers: { '@type': 'Offer', price: p.price, priceCurrency: 'MAD', availability: 'https://schema.org/InStock' }
    });
    document.head.appendChild(ld);

    container.innerHTML = `
      <div class="product-detail">
        <img src="${imgSrc}" alt="${p.title}" />
        <div class="product-detail-info">
          <span class="badge">${p.category || 'Général'}</span>
          <h1>${p.title}</h1>
          <p class="price">${Number(p.price).toFixed(2)} MAD</p>
          <p>${p.description || ''}</p>
          <button id="addToCartBtn" class="btn">Ajouter au panier</button>
          <a href="/shop.html" class="btn btn-outline" style="margin-left:.5rem">← Boutique</a>
        </div>
      </div>
    `;

    document.getElementById('addToCartBtn').addEventListener('click', () => {
      addToCart(p);
      showToast(`"${p.title}" ajouté au panier ✓`);
    });
  } catch (e) {
    container.innerHTML = '<p class="error-msg">Erreur de chargement du produit.</p>';
  }
});
