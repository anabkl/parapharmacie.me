import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export function initAdmin(containerEl) {
  containerEl.innerHTML = `
    <h2>Gestion des produits</h2>
    <form id="product-form">
      <div class="form-group">
        <label>Nom du produit</label>
        <input type="text" id="product-name" required />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="product-desc" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Prix (€)</label>
        <input type="number" id="product-price" step="0.01" min="0" required />
      </div>
      <div class="form-group">
        <label>Image</label>
        <input type="file" id="product-image" accept="image/*" />
      </div>
      <div id="form-msg"></div>
      <button type="submit" class="btn">Ajouter le produit</button>
    </form>
    <h2 style="margin-top:32px">Liste des produits</h2>
    <div id="product-list">Chargement...</div>
  `;

  const form = document.getElementById("product-form");
  const formMsg = document.getElementById("form-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.innerHTML = "";
    const name = document.getElementById("product-name").value.trim();
    const description = document.getElementById("product-desc").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const fileInput = document.getElementById("product-image");
    const file = fileInput.files[0];

    try {
      let imageUrl = "";
      if (file) {
        const imgRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(imgRef, file);
        imageUrl = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, "products"), {
        name, description, price, image: imageUrl, createdAt: serverTimestamp()
      });
      formMsg.innerHTML = `<div class="alert alert-success">Produit ajouté avec succès.</div>`;
      form.reset();
    } catch (err) {
      formMsg.innerHTML = `<div class="alert alert-error">Erreur : ${err.message}</div>`;
    }
  });

  const productList = document.getElementById("product-list");
  onSnapshot(collection(db, "products"), (snap) => {
    if (snap.empty) {
      productList.innerHTML = "<p>Aucun produit.</p>";
      return;
    }
    productList.innerHTML = `
      <table class="cart-table">
        <thead><tr><th>Nom</th><th>Prix</th><th>Action</th></tr></thead>
        <tbody>
          ${snap.docs.map(d => {
            const p = d.data();
            return `<tr>
              <td>${p.name}</td>
              <td>${parseFloat(p.price || 0).toFixed(2)} €</td>
              <td><button class="btn btn-danger" data-id="${d.id}">Supprimer</button></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    `;
    productList.querySelectorAll(".btn-danger").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Supprimer ce produit ?")) {
          await deleteDoc(doc(db, "products", btn.dataset.id));
        }
      });
    });
  });
}
