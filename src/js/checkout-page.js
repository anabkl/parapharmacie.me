import '../../src/css/main.css';
import { getCart, saveCart, cartTotal } from './cart.js';
import { createOrder } from './orders.js';

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  const summaryEl = document.getElementById('orderSummary');
  const errorEl = document.getElementById('errorMsg');
  const successEl = document.getElementById('successMsg');

  if (!cart.length) {
    window.location.href = '/cart.html';
    return;
  }

  // Render summary
  const itemsHtml = cart.map(i => `
    <div class="summary-item">
      <span>${i.title} × ${i.qty}</span>
      <span>${(Number(i.price) * i.qty).toFixed(2)} MAD</span>
    </div>
  `).join('');

  summaryEl.innerHTML = `
    <h3>Récapitulatif</h3>
    ${itemsHtml}
    <div class="summary-total">
      <span>Total</span>
      <span>${cartTotal().toFixed(2)} MAD</span>
    </div>
  `;

  document.getElementById('checkoutForm').addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.style.display = 'none';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Traitement…';

    try {
      await createOrder({
        items: cart,
        total: cartTotal(),
        fullname: document.getElementById('fullname').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        payment: document.getElementById('payment').value,
        status: 'pending',
      });

      saveCart([]);
      successEl.textContent = 'Commande confirmée ! Nous vous contacterons bientôt. Merci !';
      successEl.style.display = 'block';
      document.getElementById('checkoutForm').style.display = 'none';
      summaryEl.style.display = 'none';
    } catch (err) {
      errorEl.textContent = 'Erreur lors de la commande. Veuillez réessayer.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Confirmer la commande';
    }
  });
});
