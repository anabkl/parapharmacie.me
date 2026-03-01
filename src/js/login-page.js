import "../css/main.css";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container" style="max-width:480px;margin:60px auto">
      <h1>Connexion</h1>
      <form id="login-form">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" id="password" required autocomplete="current-password" />
        </div>
        <div id="login-msg"></div>
        <button type="submit" class="btn">Se connecter</button>
      </form>
    </div>
  `;

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("login-msg");
    msgEl.innerHTML = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const roleSnap = await getDoc(doc(db, "roles", uid));
      if (roleSnap.exists() && roleSnap.data().role === "admin") {
        window.location.href = "/admin.html";
      } else {
        msgEl.innerHTML = `<div class="alert alert-error">Accès refusé : vous n'êtes pas administrateur.</div>`;
      }
    } catch (err) {
      msgEl.innerHTML = `<div class="alert alert-error">Erreur de connexion : ${err.message}</div>`;
    }
  });
}

renderLogin();
