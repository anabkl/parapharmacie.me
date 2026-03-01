import "../css/main.css";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { initAdmin } from "./admin";

const app = document.getElementById("app");

app.innerHTML = `<div class="container"><p>Vérification de l'accès...</p></div>`;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const roleSnap = await getDoc(doc(db, "roles", user.uid));
  if (!roleSnap.exists() || roleSnap.data().role !== "admin") {
    window.location.href = "/";
    return;
  }

  app.innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2>Admin</h2>
        <a href="/admin.html">Produits</a>
        <a href="/index.html">Voir le site</a>
        <button id="logout-btn" class="btn btn-danger" style="margin-top:auto;width:100%;margin-top:32px">Déconnexion</button>
      </aside>
      <main class="admin-content" id="admin-main"></main>
    </div>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/login.html";
  });

  initAdmin(document.getElementById("admin-main"));
});
