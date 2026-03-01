import { getProducts, deleteProduct, addProduct } from "./products";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Chart from "chart.js/auto";

export async function renderAdminProducts() {
  const container = document.getElementById("adminProducts");
  if (!container) return;

  const products = await getProducts();
  container.innerHTML = products.map(p => `
    <div>
      <strong>${p.title}</strong> - ${p.price} MAD
      <button data-id="${p.id}" class="delBtn">Supprimer</button>
    </div>
  `).join("");

  container.querySelectorAll(".delBtn").forEach(btn => {
    btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
  });
}

export async function adminCharts() {
  const salesCanvas = document.getElementById("salesChart");
  const ordersCanvas = document.getElementById("ordersChart");
  if (!salesCanvas || !ordersCanvas) return;

  const snap = await getDocs(collection(db, "orders"));
  const orders = snap.docs.map(d => d.data());

  const salesPerDay = {};
  let totalRevenue = 0;

  orders.forEach(o => {
    const day = o.createdAt?.toDate().toISOString().split("T")[0];
    salesPerDay[day] = (salesPerDay[day] || 0) + o.total;
    totalRevenue += o.total || 0;
  });

  document.getElementById("totalRevenue").textContent = totalRevenue;

  new Chart(salesCanvas, {
    type: "line",
    data: {
      labels: Object.keys(salesPerDay),
      datasets: [{ label: "Ventes", data: Object.values(salesPerDay) }]
    }
  });

  const statusCount = orders.reduce((acc, o) => {
    acc[o.status || "pending"] = (acc[o.status || "pending"] || 0) + 1;
    return acc;
  }, {});

  new Chart(ordersCanvas, {
    type: "pie",
    data: {
      labels: Object.keys(statusCount),
      datasets: [{ data: Object.values(statusCount) }]
    }
  });
}
