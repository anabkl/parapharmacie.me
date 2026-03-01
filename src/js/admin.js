import { getProducts, addProduct, deleteProduct, updateProduct } from "./products";

export async function renderAdmin() {
  const list = document.getElementById("adminProducts");
  if (!list) return;
  const products = await getProducts();
  list.innerHTML = products.map(p=>`
    <tr>
      <td>${p.title}</td><td>${p.price}</td><td>${p.category}</td><td>${p.stock}</td>
      <td>
        <button data-id="${p.id}" class="del btn-outline">Supprimer</button>
      </td>
    </tr>
  `).join("");
  list.querySelectorAll(".del").forEach(b=>b.onclick=()=>deleteProduct(b.dataset.id));
}

export function bindAdminForm() {
  const form=document.getElementById("productForm");
  if(!form) return;
  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const f=new FormData(form);
    await addProduct({
      title:f.get("title"),
      price:Number(f.get("price")),
      category:f.get("category"),
      stock:Number(f.get("stock")),
      description:f.get("description")
    }, f.get("image"));
    form.reset();
    renderAdmin();
  });
}
