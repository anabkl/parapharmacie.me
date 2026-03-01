import '../../src/css/main.css';
import { auth, db, storage } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function showSection(name) {
  ['dashboard', 'products', 'orders'].forEach(s => {
    document.getElementById(`section-${s}`).style.display = s === name ? 'block' : 'none';
  });
  document.querySelectorAll('.admin-sidebar nav a[data-section]').forEach(a => {
    a.classList.toggle('active', a.dataset.section === name);
  });
}

function initDashboard() {
  const unsubscribes = [];

  // Sidebar navigation
  document.querySelectorAll('.admin-sidebar nav a[data-section]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      showSection(a.dataset.section);
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async e => {
    e.preventDefault();
    unsubscribes.forEach(fn => fn());
    await signOut(auth);
    window.location.href = '/login.html';
  });

  // Add product form
  document.getElementById('addProductForm').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('productFormMsg');
    msgEl.className = 'success-msg';
    msgEl.style.display = 'none';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi…';

    const file = document.getElementById('prodImage').files[0];
    let imageUrl = '';
    try {
      if (file) {
        const imgRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(imgRef, file);
        imageUrl = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, 'products'), {
        title: document.getElementById('prodTitle').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        category: document.getElementById('prodCategory').value,
        stock: parseInt(document.getElementById('prodStock').value) || 0,
        description: document.getElementById('prodDesc').value,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });
      e.target.reset();
      msgEl.textContent = 'Produit ajouté avec succès !';
      msgEl.style.display = 'block';
      setTimeout(() => { msgEl.style.display = 'none'; }, 3000);
    } catch (err) {
      msgEl.className = 'error-msg';
      msgEl.textContent = 'Erreur lors de l\'ajout du produit.';
      msgEl.style.display = 'block';
    }
    btn.disabled = false;
    btn.textContent = 'Ajouter le produit';
  });

  // Real-time products
  const unsubProducts = onSnapshot(collection(db, 'products'), snap => {
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('statProducts').textContent = products.length;
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image || 'https://placehold.co/50x50?text=P'}" alt="${p.title}" /></td>
        <td>${p.title}</td>
        <td>${p.category || ''}</td>
        <td>${Number(p.price).toFixed(2)} MAD</td>
        <td>${p.stock ?? 0}</td>
        <td><button class="btn btn-sm btn-danger del-product" data-id="${p.id}">Supprimer</button></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.del-product').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Supprimer ce produit ?')) {
          await deleteDoc(doc(db, 'products', btn.dataset.id));
        }
      });
    });
  });
  unsubscribes.push(unsubProducts);

  // Real-time orders
  const unsubOrders = onSnapshot(collection(db, 'orders'), snap => {
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('statOrders').textContent = orders.length;
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    document.getElementById('statRevenue').textContent = revenue.toFixed(2);
    const tbody = document.getElementById('ordersTable');
    tbody.innerHTML = orders.map(o => {
      const date = o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('fr-FR') : '–';
      return `
        <tr>
          <td style="font-size:.75rem;color:var(--gray)">${o.id.slice(0, 8)}…</td>
          <td>${o.fullname || '–'}</td>
          <td>${o.phone || '–'}</td>
          <td>${Number(o.total || 0).toFixed(2)} MAD</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              ${['pending','confirmed','shipped','delivered'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </td>
          <td>${date}</td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        await updateDoc(doc(db, 'orders', sel.dataset.id), { status: sel.value });
      });
    });
  });
  unsubscribes.push(unsubOrders);
}

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = '/login.html';
      return;
    }
    const snap = await getDoc(doc(db, 'roles', user.uid));
    if (!snap.exists() || snap.data().role !== 'admin') {
      window.location.href = '/index.html';
      return;
    }
    initDashboard();
  });
});
