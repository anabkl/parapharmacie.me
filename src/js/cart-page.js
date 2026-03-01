import '../../src/css/main.css';
import { getCart, saveCart, updateQty, cartTotal } from './cart.js';

function render() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const totalAmountEl = document.getElementById('totalAmount');

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="icon">🛒</div>
        <p>Votre panier est vide.</p>
        <a href="/shop.html" class="btn" style="margin-top:1rem">Voir la boutique</a>
      </div>
    `;
    totalEl.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image || 'https://placehold.co/80x80?text=P'}" alt="${item.title}" />
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p class="price">${(Number(item.price) * item.qty).toFixed(2)} MAD</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn decrease" data-id="${item.id}">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn increase" data-id="${item.id}">+</button>
      </div>
      <button class="btn btn-sm btn-danger remove-btn" data-id="${item.id}">✕</button>
    </div>
  `).join('');

  totalAmountEl.textContent = `${cartTotal().toFixed(2)} MAD`;
  totalEl.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  render();

  document.getElementById('cartItems').addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    const cart = getCart();
    const item = cart.find(i => i.id === id);

    if (e.target.classList.contains('increase')) {
      updateQty(id, item.qty + 1);
    } else if (e.target.classList.contains('decrease')) {
      if (item.qty <= 1) {
        saveCart(cart.filter(i => i.id !== id));
      } else {
        updateQty(id, item.qty - 1);
      }
    } else if (e.target.classList.contains('remove-btn')) {
      saveCart(cart.filter(i => i.id !== id));
    }
    render();
  });

  document.getElementById('emptyCartBtn').addEventListener('click', () => {
    saveCart([]);
    render();
  });
});
