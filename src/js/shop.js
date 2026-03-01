import { getProducts } from "./products";
import { addToCart } from "./cart";

export async function renderShop() {
  const grid=document.getElementById("productsGrid");
  if(!grid) return;
  const products=await getProducts();
  grid.innerHTML=products.map(p=>`
    <div class="card">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="badge">${p.category}</div>
      <strong>${p.title}</strong>
      <span>${p.price} MAD</span>
      <button class="btn" data-id="${p.id}">Ajouter</button>
    </div>
  `).join("");
  grid.querySelectorAll("button").forEach(btn=>{
    const p=products.find(x=>x.id===btn.dataset.id);
    btn.onclick=()=>addToCart(p,1);
  });
}
